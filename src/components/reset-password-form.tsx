'use client';

import React, { useState } from 'react';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { resetPasswordAction } from "@/app/(auth)/reset-password/actions"
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react'

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (!passwordRegex.test(password)) {
            setError("Mot de passe invalide (8+ car., 1 maj., 1 spécial).");
            return;
        }

        setIsLoading(true);

        try {
            const result = await resetPasswordAction(password);

            if (result.success) {
                setSuccessMessage("Votre mot de passe a été réinitialisé avec succès !");
                setTimeout(() => router.push('/login'), 3000);
            } else {
                setError(result.error || "Une erreur est survenue.");
            }
        } catch (err) {
            setError("Une erreur serveur est survenue.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-slate-200 bg-white text-slate-900 shadow-xl relative overflow-hidden">
        {/* Accent line - Brand Gradient */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#ffd166] to-[#260936]" />
        
        <CardHeader className="space-y-1 text-center pt-10">
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Nouveau mot de passe</CardTitle>
          <CardDescription className="text-slate-500 text-sm font-medium px-4">
            Choisissez votre nouveau mot de passe sécurisé.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-center gap-3">
                <div className="size-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm rounded-lg border border-green-100 flex items-center gap-3">
                <div className="size-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                {successMessage}
            </div>
          )}

          {!successMessage && (
            <form onSubmit={handleSubmit}>
              <FieldGroup className="gap-6">
                <Field>
                  <FieldLabel htmlFor="password" className="text-slate-700 text-[11px] font-bold uppercase tracking-wider ml-1">Nouveau mot de passe</FieldLabel>
                  <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#260936] transition-colors" size={18} />
                      <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"} 
                          required 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-slate-50 border-slate-200 text-slate-900 pl-11 pr-11 focus:border-[#260936] focus:ring-1 focus:ring-[#260936] transition-all h-12 rounded-xl"
                      />
                      <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#260936] transition-colors"
                      >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword" className="text-slate-700 text-[11px] font-bold uppercase tracking-wider ml-1">Confirmation</FieldLabel>
                  <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#260936] transition-colors" size={18} />
                      <Input 
                          id="confirmPassword" 
                          type={showPassword ? "text" : "password"} 
                          required 
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="bg-slate-50 border-slate-200 text-slate-900 pl-11 h-12 rounded-xl focus:border-[#260936] focus:ring-1 focus:ring-[#260936] transition-all"
                      />
                  </div>
                </Field>
                
                <Field className="pt-2">
                  <Button type="submit" disabled={isLoading} className="w-full bg-[#260936] hover:bg-[#6026a3] text-white font-bold h-12 transition-all shadow-lg shadow-[#260936]/10 rounded-xl text-sm uppercase tracking-wide">
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Mettre à jour"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          )}

          {successMessage && (
            <div className="text-center mt-4">
               <Button 
                   onClick={() => router.push('/login')} 
                   className="bg-[#260936] hover:bg-[#6026a3] text-white font-bold h-11 px-8 transition-all shadow-lg shadow-[#260936]/10 rounded-xl text-sm uppercase tracking-wide"
               >
                   Aller à la connexion
               </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
