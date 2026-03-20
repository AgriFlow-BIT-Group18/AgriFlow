"use client";

import * as React from "react";
import { Eye, EyeOff, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { resetPassword } from "@/services/authService";

export default function ResetPasswordPage() {
    const { token } = useParams();
    const router = useRouter();
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [isSuccess, setIsSuccess] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        if (password.length < 6) {
            setError("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        setIsLoading(true);

        try {
            await resetPassword(token as string, password);
            setIsSuccess(true);
        } catch (err: any) {
            console.error("Reset password failed:", err);
            setError(err.response?.data?.message || "Échec de la réinitialisation du mot de passe. Le lien a peut-être expiré.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background-alt px-6">
                <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl ring-1 ring-black/5 text-center">
                    <div className="flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-status-approved/10 text-status-approved">
                            <CheckCircle2 size={32} />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-text-primary">Mot de passe réinitialisé !</h2>
                    <p className="text-text-secondary">
                        Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                    </p>
                    
                    <div className="pt-4">
                        <Link href="/login" className="w-full">
                            <Button className="w-full h-12 text-sm font-bold flex items-center justify-center gap-2">
                                Se connecter maintenant <ArrowRight size={18} />
                            </Button>
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
                        <ShieldCheck className="text-primary" size={24} />
                    </div>
                    <h2 className="mt-4 text-3xl font-bold text-text-primary">Nouveau mot de passe</h2>
                    <p className="mt-2 text-sm text-text-secondary">Veuillez choisir un mot de passe sécurisé.</p>
                </div>

                {error && (
                    <div className="rounded-lg bg-status-rejected/10 p-3 text-center text-sm font-semibold text-status-rejected ring-1 ring-status-rejected/20">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <Input
                            label="Nouveau mot de passe"
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-text-secondary hover:text-primary transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <Input
                        label="Confirmer le mot de passe"
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <Button
                        type="submit"
                        className="w-full h-10 text-sm font-bold shadow-lg shadow-primary/20"
                        isLoading={isLoading}
                    >
                        {isLoading ? "Mise à jour..." : "Réinitialiser le mot de passe"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
