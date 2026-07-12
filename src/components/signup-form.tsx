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
import { signupAction } from "@/app/(auth)/signup/actions"
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, User, Phone, Mail, Lock } from 'lucide-react'

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [telephone, setTelephone] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        
        if (!email || !password || !confirmPassword || !nom || !prenom) {
            setError("Tous les champs sont obligatoires.");
            return;
        }

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
            const result = await signupAction({
                email,
                password,
                confirmPassword,
                nom,
                prenom,
                telephone
            });

            if (result.success) {
                if (result.needsConfirmation) {
                    setSuccessMessage("Compte créé avec succès ! Veuillez confirmer votre email pour pouvoir vous connecter.");
                } else {
                    router.push('/login');
                }
            } else {
                setError(result.error || "Une erreur est survenue.");
            }
        } catch (err) {
            setIsLoading(false);
            setError("Une erreur inattendue est survenue.");
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
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Inscription</CardTitle>
          <CardDescription className="text-slate-500 text-sm font-medium">
            Devenez membre du réseau citoyenne.
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
                <FieldGroup className="gap-5">
                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor="prenom" className="text-slate-700 text-[11px] font-bold uppercase tracking-wider ml-1">Prénom</FieldLabel>
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#260936] transition-colors" size={16} />
                            <Input
                                id="prenom"
                                type="text"
                                required
                                value={prenom}
                                onChange={(e) => setPrenom(e.target.value)}
                                placeholder="Johanna"
                                className="bg-slate-50 border-slate-200 text-slate-900 pl-10 h-11 text-sm focus:border-[#260936] focus:ring-1 focus:ring-[#260936] transition-all rounded-xl"
                            />
                        </div>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="nom" className="text-slate-700 text-[11px] font-bold uppercase tracking-wider ml-1">Nom</FieldLabel>
                        <div className="relative group">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#260936] transition-colors" size={16} />
                            <Input
                                id="nom"
                                type="text"
                                required
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                placeholder="IPSSI"
                                className="bg-slate-50 border-slate-200 text-slate-900 pl-10 h-11 text-sm focus:border-[#260936] focus:ring-1 focus:ring-[#260936] transition-all rounded-xl"
                            />
                        </div>
                    </Field>
                </div>

                <Field>
                    <FieldLabel htmlFor="telephone" className="text-slate-700 text-[11px] font-bold uppercase tracking-wider ml-1">Téléphone</FieldLabel>
                    <div className="relative group">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#260936] transition-colors" size={16} />
                        <Input
                            id="telephone"
                            type="tel"
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                            placeholder="06 01 02 03 04"
                            className="bg-slate-50 border-slate-200 text-slate-900 pl-10 h-11 text-sm focus:border-[#260936] focus:ring-1 focus:ring-[#260936] transition-all rounded-xl"
                        />
                    </div>
                </Field>

                <Field>
                    <FieldLabel htmlFor="email" className="text-slate-700 text-[11px] font-bold uppercase tracking-wider ml-1">Email</FieldLabel>
                    <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#260936] transition-colors" size={16} />
                        <Input
                            id="email"
                            type="email"
                            placeholder="nom@exemple.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-slate-50 border-slate-200 text-slate-900 pl-10 h-11 text-sm focus:border-[#260936] focus:ring-1 focus:ring-[#260936] transition-all rounded-xl"
                        />
                    </div>
                </Field>

                <Field>
                    <FieldLabel htmlFor="password" className="text-slate-700 text-[11px] font-bold uppercase tracking-wider ml-1">Mot de passe</FieldLabel>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#260936] transition-colors" size={16} />
                        <Input 
                            id="password" 
                            type={showPassword ? "text" : "password"} 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-slate-50 border-slate-200 text-slate-900 pl-10 pr-10 h-11 text-sm focus:border-[#260936] focus:ring-1 focus:ring-[#260936] transition-all rounded-xl"
                            placeholder="8+ car., 1 maj., 1 spécial"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#260936] transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </Field>

                <Field>
                    <FieldLabel htmlFor="confirmPassword" className="text-slate-700 text-[11px] font-bold uppercase tracking-wider ml-1">Confirmation</FieldLabel>
                    <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#260936] transition-colors" size={16} />
                        <Input 
                            id="confirmPassword" 
                            type={showConfirmPassword ? "text" : "password"} 
                            required 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="bg-slate-50 border-slate-200 text-slate-900 pl-10 pr-10 h-11 text-sm focus:border-[#260936] focus:ring-1 focus:ring-[#260936] transition-all rounded-xl"
                            placeholder="Répétez le mot de passe"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#260936] transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </Field>

                <Field className="pt-2">
                    <Button type="submit" disabled={isLoading} className="w-full bg-[#260936] hover:bg-[#6026a3] text-white font-bold h-11 transition-all shadow-lg shadow-[#260936]/10 rounded-xl text-sm uppercase tracking-wide">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Créer mon compte"}
                    </Button>
                    <div className="text-center text-sm text-slate-500 mt-6">
                    Déjà membre ?{" "}
                    <button 
                        type="button"
                        onClick={() => router.push('/login')}
                        className="text-[#260936] hover:text-slate-900 font-black underline underline-offset-4 transition-colors"
                    >
                        Se connecter
                    </button>
                    </div>
                </Field>
                </FieldGroup>
            </form>
          )}
          {successMessage && (
             <div className="text-center mt-6">
                <Button onClick={() => router.push('/login')} className="bg-[#260936] hover:bg-[#6026a3] text-white font-bold h-11 px-8 transition-all shadow-lg shadow-[#260936]/10 rounded-xl text-sm uppercase tracking-wide">
                    Retour à la connexion
                </Button>
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
