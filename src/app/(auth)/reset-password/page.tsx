// * src/app/(auth)/reset-password/page.tsx
'use client';

import { ResetPasswordForm } from "@/components/reset-password-form"

export default function ResetPasswordPage() {
    return (
        <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center p-6 md:p-10 bg-[#eedeff]">
            <div className="flex w-full max-w-md flex-col gap-8">
                <ResetPasswordForm />
            </div>
        </div>
    )
}
