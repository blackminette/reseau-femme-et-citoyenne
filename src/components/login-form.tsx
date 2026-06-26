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
import { loginAction } from "@/app/(auth)/login/actions"
import { useRouter } from 'next/navigation'
import { supabaseClient } from '@/lib/supabaseClient'
import { Eye, EyeOff, Loader2, Lock, User } from 'lucide-react'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginAction({ username, password });

      if (result.success && result.role) {
        try {
          const { data: { session } } = await supabaseClient.auth.getSession();
          if (session) {
            await supabaseClient.auth.setSession({
              access_token: session.access_token,
              refresh_token: session.refresh_token
            });
          } else {
            await supabaseClient.auth.refreshSession();
          }
        } catch (syncError) {
          console.warn("Erreur de synchronisation client/serveur :", syncError);
        }

        router.refresh();
        const destination = `/${result.role.toLowerCase()}`;
        router.push(destination);
      } else {
        setIsLoading(false);
        setError(result.error || "Identifiants incorrects.");
      }
    } catch (err) {
      setIsLoading(false);
      setError("Une erreur serveur est survenue.");
      console.error(err);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-slate-200 bg-white text-slate-900 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#ffd166] to-[#260936]" />

        <CardHeader className="space-y-1 text-center pt-10">
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Connexion</CardTitle>
          <CardDescription className="text-slate-500 text-sm font-medium">
            Heureux de vous revoir parmi nous.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-center gap-3">
              <div className="size-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-6">
              <Field>
                <FieldLabel htmlFor="username" className="text-slate-700 text-[11px] font-bold uppercase tracking-wider ml-1">Nom d'utilisateur</FieldLabel>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#260936] transition-colors" size={18} />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Ex: johanna_admin"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-slate-50 border-slate-200 text-slate-900 pl-11 focus:border-[#260936] focus:ring-1 focus:ring-[#260936] transition-all h-12 rounded-xl"
                  />
                </div>
              </Field>
              <Field>
                <div className="flex items-center justify-between mb-1">
                  <FieldLabel htmlFor="password" className="text-slate-700 text-[11px] font-bold uppercase tracking-wider ml-1">Mot de passe</FieldLabel>
                  <button
                    type="button"
                    onClick={() => router.push('/forgot-password')}
                    className="text-xs text-[#260936] hover:text-[#6026a3] active:scale-95 transition-all font-bold duration-200 cursor-pointer"
                  >
                    Oublié ?
                  </button>
                </div>
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
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#260936] active:scale-90 transition-all duration-150 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </Field>
              <Field className="pt-2">
                <Button type="submit" disabled={isLoading} className="w-full bg-[#260936] hover:bg-[#6026a3] active:scale-[0.98] text-white font-bold h-12 transition-all shadow-lg shadow-[#260936]/10 rounded-xl text-sm uppercase tracking-wide duration-200 cursor-pointer">
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Se connecter"}
                </Button>
                <div className="text-center text-sm text-slate-500 mt-8">
                  Nouveau sur la plateforme ?{" "}
                  <button
                    type="button"
                    onClick={() => router.push('/signup')}
                    className="text-[#260936] hover:text-[#6026a3] active:scale-95 font-black underline underline-offset-4 transition-all duration-200 cursor-pointer"
                  >
                    Créer un compte
                  </button>
                </div>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}