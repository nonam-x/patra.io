import { LoginForm } from "~/components/login-form"

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-[var(--color-landing-bg)] overflow-hidden">
      {/* Subtle glow backdrop effects */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-[var(--color-landing-accent)]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[var(--color-landing-accent)]/5 blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-sm relative z-10">
        <LoginForm />
      </div>
    </div>
  )
}
