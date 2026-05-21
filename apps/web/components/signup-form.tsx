"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock, Mail, User, Sparkles } from "lucide-react";
import { useAuth } from "~/hooks/use-auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { toast } from "sonner";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const { signup, isSigningUp, signupError } = useAuth();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await signup(data);
      setSuccess(true);
      toast.success("Account created successfully!");
    } catch (e: any) {
      toast.error(e.message ?? "Registration failed. Please try again.");
    }
  };

  return (
    <Card className="border-[#27272A] bg-[#111111] text-[#FAFAFA] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
      {/* Top indicator bar */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#EC4899]" />

      <CardHeader className="space-y-1 px-8 pt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center">
            <span className="font-bold text-sm tracking-tight text-white">P</span>
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[10px] font-semibold text-[#8B5CF6]">
            <Sparkles size={10} />
            <span>2026 Edition</span>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
        <CardDescription className="text-[#A1A1AA] text-sm">
          Enter your details below to get started with Patra.io.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {signupError && (
            <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/30 text-red-200 text-xs">
              {signupError}
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A1A1AA]" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-3.5 text-[#A1A1AA]" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="pl-10 bg-[#18181B] border-[#27272A] text-white focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/20"
                disabled={isSigningUp}
                {...register("name")}
              />
            </div>
            {errors.name && (
              <span className="text-[11px] text-red-400 font-mono block">{errors.name.message}</span>
            )}
          </div>

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
                disabled={isSigningUp}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <span className="text-[11px] text-red-400 font-mono block">{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A1A1AA]" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-3.5 text-[#A1A1AA]" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10 bg-[#18181B] border-[#27272A] text-white focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/20"
                disabled={isSigningUp}
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
            disabled={isSigningUp}
          >
            {isSigningUp ? "Creating Account..." : "Create Account"}
            {!isSigningUp && <ArrowRight size={15} />}
          </Button>
        </form>
        <div className="text-center text-xs text-[#A1A1AA]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#8B5CF6] hover:underline font-semibold">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
