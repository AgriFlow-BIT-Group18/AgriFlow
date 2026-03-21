"use client";

import * as React from "react";
import { Cpu, ShieldCheck, Cloud, Zap } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export function Technology() {
    const { t } = useTranslation();

    const techItems = [
        {
            title: t('tech_item_1_title'),
            desc: t('tech_item_1_desc'),
            icon: Cpu,
            color: "text-blue-500"
        },
        {
            title: t('tech_item_2_title'),
            desc: t('tech_item_2_desc'),
            icon: ShieldCheck,
            color: "text-green-500"
        },
        {
            title: t('tech_item_3_title'),
            desc: t('tech_item_3_desc'),
            icon: Cloud,
            color: "text-primary"
        }
    ];

    return (
        <section id="technology" className="py-24 bg-background relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <h2 className="text-sm font-bold text-primary uppercase tracking-widest">{t('tech_badge')}</h2>
                    <h3 className="text-4xl lg:text-5xl font-black text-text-primary leading-tight">
                        {t('tech_title')}
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {techItems.map((item, i) => (
                        <div key={i} className="relative group">
                            <div className="absolute -inset-4 rounded-3xl bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative space-y-6">
                                <div className="h-16 w-16 rounded-2xl bg-white shadow-xl shadow-gray-200/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <item.icon className={item.color} size={32} />
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-xl font-bold text-text-primary">{item.title}</h4>
                                    <p className="text-text-secondary font-medium leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                                <div className="pt-4 flex items-center gap-2 text-sm font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2">
                                    {t('learn_more')} <Zap size={14} fill="currentColor" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
