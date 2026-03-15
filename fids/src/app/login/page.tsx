"use client";

import * as React from "react";

import { Mail, Eye, EyeOff, Leaf } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

import { login } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [showPassword, setShowPassword] = React.useState(false);
    const [role, setRole] = React.useState<"admin" | "distributor">("admin");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const user = await login(email, password);
            // Redirect based on role or just to dashboard if admin
            if (user.role === "admin") {
                router.push("/dashboard");
            } else if (user.role.toLowerCase() === "distributor") {
                router.push("/dashboard");
            } else {
                router.push("/dashboard");
            }
        } catch (err: unknown) {
            console.error("Login failed:", err);
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full font-sans">
            {/* Left side - Illustration/Brand */}
            <div className="relative hidden w-1/2 flex-col bg-primary lg:flex">
                <div className="absolute inset-0 z-0 opacity-20">
                    {/* Overlay pattern or image could go here */}
                    <div className="h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent" />
                </div>

                <div className="relative z-10 flex flex-1 flex-col justify-between p-12 text-white">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md">
                            <Leaf className="text-secondary fill-current" size={28} />
                        </div>
                        <span className="text-3xl font-bold tracking-tight">AgriFlow</span>
                    </div>

                    <div className="max-w-lg">
                        <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
                            Modernizing agricultural input distribution.
                        </h1>
                        <p className="mt-6 text-lg text-white/80">
                            A complete digital ecosystem for farmers, distributors, and administrators to streamline seed and fertilizer management.
                        </p>
                    </div>

                    <div className="text-sm text-white/50">
                        © 2026 AgriFlow Ecosystem • All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right side - Login Form */}
            <div className="flex w-full items-center justify-center bg-background-alt px-6 lg:w-1/2 lg:px-12">
                <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl ring-1 ring-black/5">
                    <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 lg:hidden">
                            <Leaf className="text-primary fill-current" size={24} />
                        </div>
                        <h2 className="mt-4 text-3xl font-bold text-text-primary">Welcome back</h2>
                        <p className="mt-2 text-sm text-text-secondary">Sign in to your account</p>
                    </div>

                    {error && (
                        <div className="rounded-lg bg-status-rejected/10 p-3 text-center text-sm font-semibold text-status-rejected ring-1 ring-status-rejected/20">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <Input
                            label="Email address"
                            placeholder="name@company.com"
                            type="email"
                            icon={<Mail size={18} />}
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <div className="relative">
                            <Input
                                label="Password"
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
                            <div className="mt-1 text-right">
                                <a href="#" className="text-xs font-medium text-primary hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-10 text-sm font-bold shadow-lg shadow-primary/20"
                            isLoading={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>

                        <div className="relative flex items-center py-2">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="mx-4 flex-shrink text-xs font-medium uppercase text-gray-400">
                                Sign in as
                            </span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <div className="flex gap-2">
                            {(["admin", "distributor"] as const).map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    className={cn(
                                        "flex-1 rounded-full border py-2 text-xs font-semibold capitalize transition-all",
                                        role === r
                                            ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                                            : "border-gray-200 text-text-secondary hover:border-primary hover:text-primary"
                                    )}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </form>

                    <p className="text-center text-sm text-text-secondary">
                        No account?{" "}
                        <a href="#" className="font-semibold text-primary hover:underline">
                            Contact your administrator
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
