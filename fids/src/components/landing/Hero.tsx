"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Play, Server, Shield, Globe, X } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

export function Hero() {
    const { t } = useTranslation();
    const [showDemo, setShowDemo] = React.useState(false);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-sidebar">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="/images/hero-bg.png" 
                    alt="AgriFlow Hero" 
                    className="h-full w-full object-cover opacity-40 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-sidebar/60 via-sidebar/20 to-sidebar" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 text-center lg:text-left flex flex-col lg:flex-row items-center gap-16">
                <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-left duration-1000">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-bold text-secondary">
                        <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse" />
                        {t('hero_tech_badge')}
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
                        {t('hero_title_1')} <br />
                        <span className="text-secondary">{t('hero_title_2')}</span> <br />
                        {t('hero_title_3')}
                    </h1>
                    
                    <p className="max-w-xl text-base sm:text-lg lg:text-xl text-white/70 font-medium leading-relaxed mx-auto lg:mx-0">
                        {t('hero_subtitle')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                        <Link href="/login" className="w-full sm:w-auto">
                            <Button className="h-14 px-10 text-lg font-bold w-full shadow-2xl shadow-primary/40 hover:scale-105 transition-transform uppercase tracking-widest">
                                {t('hero_cta_start')} <ArrowRight className="ml-2" size={20} />
                            </Button>
                        </Link>
                        <Button 
                            variant="ghost" 
                            onClick={() => setShowDemo(true)}
                            className="h-14 px-8 text-white font-bold hover:bg-white/10 gap-2 w-full sm:w-auto"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                                <Play size={16} fill="white" />
                            </div>
                            {t('hero_cta_demo')}
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 pt-8 border-t border-white/10">
                        {[
                            { label: t('hero_stat_farmers'), value: '300+' },
                            { label: t('hero_stat_countries'), value: '10+' },
                            { label: t('hero_stat_deliveries'), value: '5k+' },
                        ].map((stat) => (
                            <div key={stat.label} className="flex flex-col items-center lg:items-start">
                                <div className="text-2xl sm:text-3xl font-black text-white">{stat.value}</div>
                                <div className="text-[10px] sm:text-xs font-bold text-white/40 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dashboard Preview / Floating Card */}
                <div className="flex-1 relative animate-in zoom-in fade-in duration-1000 delay-500">
                    <div className="relative rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl shadow-2xl">
                        <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-tr from-primary/50 to-secondary/50 opacity-20 blur-2xl" />
                        <div className="relative overflow-hidden rounded-2xl bg-[#0F172A] p-2 aspect-[4/3] flex flex-col">
                            {/* Fake Menu */}
                            <div className="flex items-center justify-between p-4 border-b border-white/5">
                                <div className="flex gap-2">
                                    <div className="h-3 w-3 rounded-full bg-red-500/50" />
                                    <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                                    <div className="h-3 w-3 rounded-full bg-green-500/50" />
                                </div>
                                <div className="h-4 w-32 rounded bg-white/5" />
                                <div className="h-6 w-6 rounded-full bg-primary/20" />
                            </div>
                            {/* Fake Content */}
                            <div className="flex-1 p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-24 rounded-xl bg-white/5 border border-white/5 p-4 space-y-2">
                                        <div className="h-3 w-12 rounded bg-secondary/30" />
                                        <div className="h-8 w-16 rounded bg-white/10" />
                                    </div>
                                    <div className="h-24 rounded-xl bg-white/5 border border-white/5 p-4 space-y-2">
                                        <div className="h-3 w-12 rounded bg-accent/30" />
                                        <div className="h-8 w-16 rounded bg-white/10" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-3 w-full rounded bg-white/5" />
                                    <div className="h-3 w-[80%] rounded bg-white/5" />
                                    <div className="h-3 w-[60%] rounded bg-primary/20" />
                                </div>
                                <div className="h-32 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 relative overflow-hidden">
                                     <div className="absolute inset-x-0 bottom-0 h-1/2 bg-secondary/10 blur-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Floating elements */}
                    <div className="absolute -top-6 -right-6 h-20 w-20 rounded-2xl bg-accent p-4 shadow-2xl animate-bounce-subtle">
                        <Shield className="text-white h-full w-full" />
                    </div>
                    <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-4 shadow-2xl flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                            <Globe size={24} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-text-secondary">{t('hero_status_label')}</div>
                            <div className="text-sm font-black text-text-primary">{t('hero_status_active')}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Demo Modal */}
            {showDemo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-sidebar/95 backdrop-blur-2xl animate-in fade-in duration-300">
                    <div className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                        {/* Cinematic Demo Video Representation */}
                        <div className="absolute inset-0 flex items-center justify-center group/player">
                            <img 
                                src="/images/demo-video-thumb.png" 
                                className="w-full h-full object-cover transition-transform duration-[10s] group-hover/player:scale-110" 
                                alt="Demo Content"
                            />
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] group-hover/player:backdrop-blur-0 transition-all duration-700" />
                            
                            <div className="relative z-10 text-center space-y-6 group-hover/player:scale-110 transition-transform duration-500">
                                <div className="h-24 w-24 rounded-full bg-primary/20 backdrop-blur-xl flex items-center justify-center border border-primary/40 shadow-2xl shadow-primary/20 group-hover/player:bg-primary/40 transition-colors">
                                    <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white shadow-xl animate-pulse">
                                        <Play fill="white" className="ml-1" size={32} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-3xl font-black text-white drop-shadow-2xl">{t('hero_demo_title')}</h4>
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                        <p className="text-white/80 font-bold text-sm uppercase tracking-[0.2em]">Live Demo Preview</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Controls Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 flex items-center justify-between bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="flex items-center gap-6 w-full max-w-xl">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white">
                                    <Play size={16} fill="white" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-1 w-full rounded-full bg-white/20 relative overflow-hidden">
                                        <div className="absolute inset-y-0 left-0 w-1/3 bg-primary animate-[shimmer_2s_infinite]" />
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-mono text-white/60 tracking-wider">
                                        <span>01:42</span>
                                        <span className="text-primary font-bold tracking-[0.3em]">PROCESSING DATA...</span>
                                        <span>04:15</span>
                                    </div>
                                </div>
                            </div>
                            <Button 
                                variant="ghost" 
                                className="text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 px-6 h-10 border border-white/10" 
                                onClick={() => setShowDemo(false)}
                            >
                                {t('hero_demo_close')}
                            </Button>
                        </div>

                        <button 
                            onClick={() => setShowDemo(false)}
                            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent z-0" />
        </section>
    );
}
