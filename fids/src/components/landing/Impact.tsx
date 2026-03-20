"use client";

import * as React from "react";
import { TrendingUp, Recycle, Users, Sprout } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export function Impact() {
    const { t } = useTranslation();

    const stats = [
        {
            label: t('impact_stat_1_label'),
            value: "25%",
            icon: TrendingUp,
            suffix: "+"
        },
        {
            label: t('impact_stat_2_label'),
            value: "40%",
            icon: Recycle,
            suffix: "-"
        },
        {
            label: t('impact_stat_3_label'),
            value: "10k",
            icon: Users,
            suffix: "+"
        }
    ];

    return (
        <section id="impact" className="py-24 bg-sidebar relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 space-y-6 text-center lg:text-left">
                        <h2 className="text-sm font-bold text-secondary uppercase tracking-widest">{t('impact_badge')}</h2>
                        <h3 className="text-4xl lg:text-5xl font-black text-white leading-tight">
                            {t('impact_title')}
                        </h3>
                        <p className="text-white/60 text-lg font-medium max-w-xl mx-auto lg:mx-0">
                            {t('impact_description')}
                        </p>
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                        {stats.map((stat, i) => (
                            <div 
                                key={i} 
                                className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col items-center lg:items-start space-y-4 hover:border-secondary/30 transition-colors group"
                            >
                                <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                                    <stat.icon size={24} />
                                </div>
                                <div className="space-y-1 text-center lg:text-left">
                                    <div className="text-4xl font-black text-white">
                                        {stat.value}<span className="text-secondary">{stat.suffix}</span>
                                    </div>
                                    <div className="text-sm font-bold text-white/40 uppercase tracking-widest">
                                        {stat.label}
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Decorative Card */}
                        <div className="hidden sm:flex p-8 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 items-center justify-center text-center">
                            <div className="space-y-2">
                                <Sprout className="text-white mx-auto" size={40} />
                                <div className="text-white font-bold text-lg">Cultiver l'avenir</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/10 blur-[150px] rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 blur-[150px] rounded-full" />
        </section>
    );
}
