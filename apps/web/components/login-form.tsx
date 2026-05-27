"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { useAuth } from "~/hooks/use-auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login, isLoggingIn, loginError, user } = useAuth();
  const router = useRouter();

  // BUG-09 fix: redirect if already authenticated
  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

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
                className="w-7 h-7 object-contain  rounded-lg py-0.5" 
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
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
              {loginError}
            </div>
          )}

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
                disabled={isLoggingIn}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <span className="text-[11px] text-red-500 font-mono block">{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold" style={{ color: "var(--color-landing-text-secondary)" }} htmlFor="password">
                Password
              </label>
              <button
                type="button"
                onClick={() => toast.info("Password reset is coming soon.")}
                className="text-xs hover:underline font-medium"
                style={{ color: "var(--color-landing-accent)" }}
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-3.5" style={{ color: "var(--color-landing-text-muted)" }} />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10 h-11 bg-[var(--color-landing-elevated)] border-[var(--color-landing-border)] text-[var(--color-landing-text)] placeholder:text-[var(--color-landing-text-muted)] focus-visible:ring-1 focus-visible:ring-[var(--color-landing-accent)] focus-visible:border-[var(--color-landing-accent)]"
                disabled={isLoggingIn}
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
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging in..." : "Login"}
            {!isLoggingIn && <ArrowRight size={15} />}
          </Button>
        </form>
        <div className="text-center text-xs mt-4" style={{ color: "var(--color-landing-text-secondary)" }}>
          Don't have an account?{" "}
          <Link href="/signup" className="hover:underline font-semibold" style={{ color: "var(--color-landing-accent)" }}>
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
