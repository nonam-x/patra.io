import {
  CreateUserWithEmailAndPasswordInputType,
  LoginInputType,
  JwtPayload,
} from "./model";
import {
  createUserWithEmailAndPasswordInput,
  loginInput,
} from "./model";
import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/schema";
import { createHmac, randomBytes } from "node:crypto";
import jwt from "jsonwebtoken";
import { env } from "../env";

class UserService {
  // ─── Private helpers ─────────────────────────────────

  private async getUserWithEmail(email: string) {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (!result || result.length === 0) return null;
    return result[0]!;
  }

  private hashPassword(password: string, salt: string): string {
    return createHmac("sha256", salt).update(password).digest("hex");
  }

  private generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });
  }

  // ─── Public methods ──────────────────────────────────

  public static verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch {
      return null;
    }
  }

  public async getUserById(id: string) {
    const result = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
        plan: usersTable.plan,
        profileImageUrl: usersTable.profileImageUrl,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id));
    if (!result || result.length === 0) return null;
    return result[0]!;
  }

  public async createUserWithEmailAndPassword(
    payload: CreateUserWithEmailAndPasswordInputType,
  ) {
    const { name, email, password } =
      await createUserWithEmailAndPasswordInput.parseAsync(payload);

    // check if user already exists
    const existingUser = await this.getUserWithEmail(email);
    if (existingUser) throw new Error("User is already registered");

    // hash password
    const salt = randomBytes(16).toString("hex");
    const hash = this.hashPassword(password, salt);

    // create user in db
    const userInsertResult = await db
      .insert(usersTable)
      .values({ name, email, password: hash, salt })
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        role: usersTable.role,
      });

    if (
      !userInsertResult ||
      userInsertResult.length === 0 ||
      !userInsertResult[0]?.id
    )
      throw new Error("User was not created");

    const user = userInsertResult[0];
    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { id: user.id, token };
  }

  public async loginWithEmailAndPassword(payload: LoginInputType) {
    const { email, password } = await loginInput.parseAsync(payload);

    const user = await this.getUserWithEmail(email);
    if (!user) throw new Error("Invalid email or password");
    if (!user.password || !user.salt)
      throw new Error("Account does not support password login");

    const hash = this.hashPassword(password, user.salt);
    if (hash !== user.password) throw new Error("Invalid email or password");

    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    };
  }
}

export default UserService;