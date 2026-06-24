// * src/app/(auth)/forgot-password/page.tsx
'use client';

import { ForgotPasswordForm } from "@/components/forgot-password-form"

export default function ForgotPasswordPage() {
    return (
        <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center p-6 md:p-10 bg-[#eedeff]">
            <div className="flex w-full max-w-md flex-col gap-8">
                <ForgotPasswordForm />
            </div>
        </div>
    )
}
