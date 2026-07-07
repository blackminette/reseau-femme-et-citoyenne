// * src/app/(auth)/signup/page.tsx
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
import { Eye, EyeOff, Loader2, User, Phone, Lock } from 'lucide-react'

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [username, setUsername] = useState('');
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

        if (!username || !password || !confirmPassword || !nom || !prenom) {
            setError("Tous les champs sont obligatoires.");
            return;
        }

        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(username)) {
            setError("Le nom d'utilisateur doit contenir entre 3 et 20 caractères (lettres, chiffres et _ uniquement).");
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
                username,
                password,
                confirmPassword,
                nom,
                prenom,
                telephone
            });

            if (result.success) {
                setSuccessMessage("Compte créé avec succès !");
            } else {
                setError(result.error || "Une erreur est survenue.");
            }
        } catch (err) {
            setError("Une erreur inattendue est survenue.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="border-slate-200 bg-white text-slate-900 shadow-xl relative overflow-hidden">
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
                    {!successMessage ? (
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
                                    <FieldLabel htmlFor="username" className="text-slate-700 text-[11px] font-bold uppercase tracking-wider ml-1">Nom d'utilisateur</FieldLabel>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#260936] transition-colors" size={16} />
                                        <Input
                                            id="username"
                                            type="text"
                                            placeholder="johanna_admin"
                                            required
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
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
                                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#260936] active:scale-90 transition-all duration-150 cursor-pointer"
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
                                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#260936] active:scale-90 transition-all duration-150 cursor-pointer"
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </Field>

                                <Field className="pt-2">
                                    <Button type="submit" disabled={isLoading} className="w-full bg-[#260936] hover:bg-[#6026a3] active:scale-[0.98] text-white font-bold h-11 transition-all shadow-lg shadow-[#260936]/10 rounded-xl text-sm uppercase tracking-wide duration-200 cursor-pointer">
                                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Créer mon compte"}
                                    </Button>
                                    <div className="text-center text-sm text-slate-500 mt-6">
                                        Déjà membre ?{" "}
                                        <button
                                            type="button"
                                            onClick={() => router.push('/login')}
                                            className="text-[#260936] hover:text-[#6026a3] active:scale-95 font-black underline underline-offset-4 transition-all duration-200 cursor-pointer"
                                        >
                                            Se connecter
                                        </button>
                                    </div>
                                </Field>
                            </FieldGroup>
                        </form>
                    ) : (
                        <div className="text-center mt-6">
                            <Button onClick={() => router.push('/login')} className="bg-[#260936] hover:bg-[#6026a3] active:scale-[0.98] text-white font-bold h-11 px-8 transition-all shadow-lg shadow-[#260936]/10 rounded-xl text-sm uppercase tracking-wide duration-200 cursor-pointer">
                                Retour à la connexion
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}