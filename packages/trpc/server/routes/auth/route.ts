import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createUserWithEmailAndPasswordInput,
  createUserWithEmailAndPasswordOutput,
  loginInput,
  loginOutput,
  meOutput,
} from "./model";
import { userService } from "../../services";
import { publicProcedure, protectedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  createUserWithEmailAndPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/register"),
        tags: TAGS,
        summary: "Register a new user",
      },
    })
    .input(createUserWithEmailAndPasswordInput)
    .output(createUserWithEmailAndPasswordOutput)
    .mutation(async ({ input }) => {
      const { name, email, password } = input;
      try {
        const result = await userService.createUserWithEmailAndPassword({
          name,
          email,
          password,
        });
        return result;
      } catch (err: any) {
        if (err.message === "User is already registered") {
          throw new TRPCError({
            code: "CONFLICT",
            message: err.message,
          });
        }
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err.message ?? "Registration failed",
        });
      }
    }),

  login: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/login"),
        tags: TAGS,
        summary: "Login with email and password",
      },
    })
    .input(loginInput)
    .output(loginOutput)
    .mutation(async ({ input }) => {
      try {
        return await userService.loginWithEmailAndPassword(input);
      } catch (err: any) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: err.message ?? "Invalid email or password",
        });
      }
    }),

  me: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/me"),
        tags: TAGS,
        summary: "Get current authenticated user",
      },
    })
    .input(z.undefined().describe("No input required"))
    .output(meOutput)
    .query(async ({ ctx }) => {
      const user = await userService.getUserById(ctx.user.id);
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }
      return {
        ...user,
        createdAt: user.createdAt?.toISOString() ?? null,
      };
    }),
});
