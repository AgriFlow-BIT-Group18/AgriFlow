"use client";

import * as React from "react";
import { Mail, ArrowLeft, Leaf, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { forgotPassword } from "@/services/authService";

export default function ForgotPasswordPage() {
    const [email, setEmail] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = React.useState(false);
    const [resetToken, setResetToken] = React.useState<string | null>(null); // For dev simulation

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const data = (await forgotPassword(email)) as any;
            setIsSubmitted(true);
            if (data.resetToken) {
                setResetToken(data.resetToken);
                console.log("Dev Reset Token:", data.resetToken);
            }
        } catch (err: unknown) {
            const axiosError = err as any;
            console.error("Forgot password request failed:", err);
            setError(axiosError.response?.data?.message || "Failed to send reset email. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background-alt px-6">
                <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl ring-1 ring-black/5 text-center">
                    <div className="flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-status-approved/10 text-status-approved">
                            <CheckCircle2 size={32} />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-text-primary">Vérifiez vos e-mails</h2>
                    <p className="text-text-secondary">
                        Si un compte existe pour <strong>{email}</strong>, nous avons envoyé des instructions pour réinitialiser votre mot de passe.
                    </p>
                    
                    {resetToken && (
                        <div className="mt-8 p-6 bg-amber-50 border-2 border-amber-200 rounded-2xl text-left shadow-lg scale-105 transition-transform">
                            <div className="flex items-center gap-2 mb-3">
                                <ShieldCheck className="text-amber-600" size={20} />
                                <p className="text-xs font-black text-amber-600 uppercase tracking-widest">Simulation Mode (Action Requise)</p>
                            </div>
                            <p className="text-sm text-amber-900/80 mb-4 font-medium">
                                En mode développement, aucun e-mail n&apos;est envoyé. <strong>Cliquez sur le bouton ci-dessous</strong> pour tester la réinitialisation :
                            </p>
                            <Link 
                                href={`/reset-password/${resetToken}`}
                                className="inline-flex items-center justify-center w-full py-3 bg-amber-600 text-white text-center rounded-xl font-black text-sm hover:bg-amber-700 transition-all shadow-md active:scale-95"
                            >
                                RÉINITIALISER LE MOT DE PASSE MAINTENANT
                            </Link>
                        </div>
                    )}

                    <div className="pt-4">
                        <Link href="/login" className="text-sm font-semibold text-primary hover:underline flex items-center justify-center gap-2">
                            <ArrowLeft size={16} /> Retour à la connexion
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background-alt px-6">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl ring-1 ring-black/5">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/5">
                        <Leaf className="text-primary fill-current" size={24} />
                    </div>
                    <h2 className="mt-4 text-3xl font-bold text-text-primary">Mot de passe oublié ?</h2>
                    <p className="mt-2 text-sm text-text-secondary">Pas de soucis, nous vous enverrons des instructions de réinitialisation.</p>
                </div>

                {error && (
                    <div className="rounded-lg bg-status-rejected/10 p-3 text-center text-sm font-semibold text-status-rejected ring-1 ring-status-rejected/20">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <Input
                        label="Adresse e-mail"
                        placeholder="nom@entreprise.com"
                        type="email"
                        icon={<Mail size={18} />}
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Button
                        type="submit"
                        className="w-full h-10 text-sm font-bold shadow-lg shadow-primary/20"
                        isLoading={isLoading}
                    >
                        {isLoading ? "Envoi..." : "Réinitialiser le mot de passe"}
                    </Button>
                </form>

                <div className="text-center">
                    <Link href="/login" className="text-sm font-semibold text-primary hover:underline flex items-center justify-center gap-2">
                        <ArrowLeft size={16} /> Retour à la connexion
                    </Link>
                </div>
            </div>
        </div>
    );
}
