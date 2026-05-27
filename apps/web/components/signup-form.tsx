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
    <Card 
      className="border-[var(--color-landing-border)] bg-[var(--color-landing-card)] text-[var(--color-landing-text)] shadow-[0_8px_30px_rgba(52,51,48,0.06)] relative overflow-hidden rounded-2xl"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      {/* Abstract background gradient decorations */}
      <div 
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-15"
        style={{
          background: "radial-gradient(circle, var(--color-landing-accent) 0%, transparent 80%)"
        }}
      />
      <div 
        className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-10"
        style={{
          background: "radial-gradient(circle, var(--color-landing-accent) 0%, transparent 80%)"
        }}
      />

      <CardHeader className="space-y-1 px-8 pt-8">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="flex items-center group">
            <div className="flex items-center gap-0 transition-transform duration-200 group-hover:scale-105">
              
              <img 
                src="/logos/patra.io-logo.png" 
                alt="Patra.io Logo" 
                className="w-7 h-7 object-contain rounded-lg py-0.5" 
              />

              <span
                className="-ml-1 font-semibold text-lg tracking-tight pt-1 pb-1.5"
                style={{ color: "var(--color-landing-text)" }}
              >
                atra
                <span style={{ color: "var(--color-landing-accent)" }}>
                  .io
                </span>
              </span>

            </div>
          </Link>
          <div 
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
            style={{
              backgroundColor: "color-mix(in srgb, var(--color-landing-accent) 10%, transparent)",
              border: "1px solid color-mix(in srgb, var(--color-landing-accent) 20%, transparent)",
              color: "var(--color-landing-accent)",
            }}
          >
            <Sparkles size={10} />
            <span>2026 Edition</span>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
        <CardDescription style={{ color: "var(--color-landing-text-secondary)" }} className="text-sm">
          Enter your details below to get started with Patra.io.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {signupError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
              {signupError}
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: "var(--color-landing-text-secondary)" }} htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-3.5" style={{ color: "var(--color-landing-text-muted)" }} />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="pl-10 h-11 bg-[var(--color-landing-elevated)] border-[var(--color-landing-border)] text-[var(--color-landing-text)] placeholder:text-[var(--color-landing-text-muted)] focus-visible:ring-1 focus-visible:ring-[var(--color-landing-accent)] focus-visible:border-[var(--color-landing-accent)]"
                disabled={isSigningUp}
                {...register("name")}
              />
            </div>
            {errors.name && (
              <span className="text-[11px] text-red-500 font-mono block">{errors.name.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: "var(--color-landing-text-secondary)" }} htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-3.5" style={{ color: "var(--color-landing-text-muted)" }} />
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                className="pl-10 h-11 bg-[var(--color-landing-elevated)] border-[var(--color-landing-border)] text-[var(--color-landing-text)] placeholder:text-[var(--color-landing-text-muted)] focus-visible:ring-1 focus-visible:ring-[var(--color-landing-accent)] focus-visible:border-[var(--color-landing-accent)]"
                disabled={isSigningUp}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <span className="text-[11px] text-red-500 font-mono block">{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold" style={{ color: "var(--color-landing-text-secondary)" }} htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-3.5" style={{ color: "var(--color-landing-text-muted)" }} />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10 h-11 bg-[var(--color-landing-elevated)] border-[var(--color-landing-border)] text-[var(--color-landing-text)] placeholder:text-[var(--color-landing-text-muted)] focus-visible:ring-1 focus-visible:ring-[var(--color-landing-accent)] focus-visible:border-[var(--color-landing-accent)]"
                disabled={isSigningUp}
                {...register("password")}
              />
            </div>
            {errors.password && (
              <span className="text-[11px] text-red-500 font-mono block">{errors.password.message}</span>
            )}
          </div>

          <Button
            type="submit"
            className="w-full text-white font-semibold h-11 transition-all rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.98]"
            style={{
              backgroundColor: "var(--color-landing-accent)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-landing-accent-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-landing-accent)")}
            disabled={isSigningUp}
          >
            {isSigningUp ? "Creating Account..." : "Create Account"}
            {!isSigningUp && <ArrowRight size={15} />}
          </Button>
        </form>
        <div className="text-center text-xs mt-4" style={{ color: "var(--color-landing-text-secondary)" }}>
          Already have an account?{" "}
          <Link href="/login" className="hover:underline font-semibold" style={{ color: "var(--color-landing-accent)" }}>
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
