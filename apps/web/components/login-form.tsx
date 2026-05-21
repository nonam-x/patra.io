"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock, Mail, Sparkles } from "lucide-react";
import { useAuth } from "~/hooks/use-auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login, isLoggingIn, loginError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
      toast.success("Successfully logged in!");
    } catch (e: any) {
      toast.error(e.message ?? "Invalid email or password.");
    }
  };

  return (
    <Card className="border-[#27272A] bg-[#111111] text-[#FAFAFA] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
      {/* Top indicator bar */}
      <div className="absolute top-0 left-0 w-full decoration-wavy h-[2px] bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#5e2742]" />

      <CardHeader className="space-y-1 px-8 pt-8">
        <div className="flex items-center justify-between mb-4">
       
          
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {loginError && (
            <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/30 text-red-200 text-xs">
              {loginError}
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A1A1AA]" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-3.5 text-[#A1A1AA]" />
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                className="pl-10 bg-[#18181B] border-[#27272A] text-white focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/20"
                disabled={isLoggingIn}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <span className="text-[11px] text-red-400 font-mono block">{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#A1A1AA]" htmlFor="password">
                Password
              </label>
              <button
                type="button"
                onClick={() => toast.info("Password recovery is simulated in dev mode.")}
                className="text-xs text-[#8B5CF6] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-3.5 text-[#A1A1AA]" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10 bg-[#18181B] border-[#27272A] text-white focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/20"
                disabled={isLoggingIn}
                {...register("password")}
              />
            </div>
            {errors.password && (
              <span className="text-[11px] text-red-400 font-mono block">{errors.password.message}</span>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#FAFAFA] hover:bg-[#FAFAFA]/90 text-[#09090B] font-bold h-11 transition-all rounded-lg flex items-center justify-center gap-1.5 active:scale-[0.98]"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging in..." : "Login"}
            {!isLoggingIn && <ArrowRight size={15} />}
          </Button>
        </form>
        <div className="text-center text-xs text-[#A1A1AA]">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[#8B5CF6] hover:underline font-semibold">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
