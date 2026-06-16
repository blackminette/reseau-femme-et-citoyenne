// * src/app/(auth)/login/page.tsx
'use client';

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center p-6 md:p-10 bg-[#eedeff]">
      <div className="flex w-full max-w-md flex-col gap-8">
        <div className="flex flex-col items-center gap-3 self-center group cursor-default">
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
