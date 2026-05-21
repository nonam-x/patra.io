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
      const result = await userService.createUserWithEmailAndPassword({
        name,
        email,
        password,
      });
      return result;
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
      return userService.loginWithEmailAndPassword(input);
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
      if (!user) throw new Error("User not found");
      return {
        ...user,
        createdAt: user.createdAt?.toISOString() ?? null,
      };
    }),
});

// Need to import z for the .input(z.undefined()) on me route
import { z } from "zod";
