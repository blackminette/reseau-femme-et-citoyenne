'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2, User, MessageSquare } from 'lucide-react';
import { submitForgotRequestAction } from "./actions";

export default function ForgotPasswordPage() {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState("Bonjour, j'ai oublié mon mot de passe. Pouvez-vous le réinitialiser s'il vous plaît ?");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsLoading(true);

        try {
            const result = await submitForgotRequestAction({ username, message });

            if (result.success) {
                setSuccessMessage("Votre demande a bien été transmise aux administrateurs.");
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
        <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center p-6 md:p-10 bg-[#eedeff]">
            <div className="flex w-full max-w-md flex-col gap-8">
                <Card className="border-slate-200 bg-white text-slate-900 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#ffd166] to-[#260936]" />

                    <CardHeader className="space-y-1 text-center pt-10">
                        <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Mot de passe oublié</CardTitle>
                        <CardDescription className="text-slate-500 text-sm font-medium">
                            Envoyez une demande de réinitialisation à un administrateur.
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
                                    <Field>
                                        <FieldLabel htmlFor="username" className="text-slate-700 text-[11px] font-bold uppercase tracking-wider ml-1">Nom d&apos;utilisateur</FieldLabel>
                                        <div className="relative group">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#260936] transition-colors" size={16} />
                                            <Input id="username" type="text" placeholder="Votre pseudo (ex: johanna_admin)" required value={username} onChange={(e) => setUsername(e.target.value)} className="bg-slate-50 border-slate-200 text-slate-900 pl-10 h-11 text-sm focus:border-[#260936] focus:ring-1 focus:ring-[#260936] transition-all rounded-xl" />
                                        </div>
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="message" className="text-slate-700 text-[11px] font-bold uppercase tracking-wider ml-1">Message</FieldLabel>
                                        <div className="relative group">
                                            <MessageSquare className="absolute left-3 top-4 text-slate-400 group-focus-within:text-[#260936] transition-colors" size={16} />
                                            <textarea id="message" required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-10 pt-3 text-sm focus:border-[#260936] focus:ring-1 focus:ring-[#260936] focus:outline-none transition-all rounded-xl resize-none" />
                                        </div>
                                    </Field>
                                    <Field className="pt-2">
                                        <Button type="submit" disabled={isLoading} className="w-full bg-[#260936] hover:bg-[#6026a3] active:scale-[0.98] text-white font-bold h-11 transition-all shadow-lg shadow-[#260936]/10 rounded-xl text-sm uppercase tracking-wide duration-200 cursor-pointer">
                                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Envoyer la demande"}
                                        </Button>
                                        <div className="text-center text-sm text-slate-500 mt-6">
                                            <button type="button" onClick={() => router.push('/login')} className="text-[#260936] hover:text-[#6026a3] active:scale-95 font-black underline underline-offset-4 transition-all duration-200 cursor-pointer">Retour à la connexion</button>
                                        </div>
                                    </Field>
                                </FieldGroup>
                            </form>
                        ) : (
                            <div className="text-center mt-6">
                                <Button onClick={() => router.push('/login')} className="bg-[#260936] hover:bg-[#6026a3] active:scale-[0.98] text-white font-bold h-11 px-8 transition-all shadow-lg shadow-[#260936]/10 rounded-xl text-sm uppercase tracking-wide duration-200 cursor-pointer">Retour à la connexion</Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
