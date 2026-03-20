"use client";

import * as React from "react";
import Link from "next/link";
import { Leaf, Twitter, Github, Linkedin, Mail } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export function Footer() {
    const { t } = useTranslation();
    return (
        <footer id="about" className="bg-sidebar border-t border-white/5 pt-24 pb-12 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <Leaf className="text-secondary" size={28} />
                            <span className="text-2xl font-black text-white tracking-tight">
                                Agri<span className="text-secondary">Flow</span>
                            </span>
                        </Link>
                        <p className="text-sm font-medium leading-relaxed max-w-xs">
                            {t('footer_desc')}
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                                <a key={i} href="#" className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-white transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {[
                        { title: t('footer_nav_product'), links: [
                            { key: 'footer_link_dashboard', label: t('footer_link_dashboard') },
                            { key: 'footer_link_analytics', label: t('footer_link_analytics') },
                            { key: 'footer_link_inventory', label: t('footer_link_inventory') },
                            { key: 'footer_link_deliveries', label: t('footer_link_deliveries') }
                        ] },
                        { title: t('footer_nav_company'), links: [
                            { key: 'footer_link_about', label: t('footer_link_about') },
                            { key: 'footer_link_impact', label: t('footer_link_impact') },
                            { key: 'footer_link_blog', label: t('footer_link_blog') },
                            { key: 'footer_link_careers', label: t('footer_link_careers') }
                        ] },
                        { title: t('footer_nav_legal'), links: [
                            { key: 'footer_link_privacy', label: t('footer_link_privacy') },
                            { key: 'footer_link_terms', label: t('footer_link_terms') },
                            { key: 'footer_link_cookies', label: t('footer_link_cookies') }
                        ] }
                    ].map((section) => (
                        <div key={section.title} className="space-y-6">
                            <h5 className="text-white font-black text-lg">{section.title}</h5>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.key}>
                                        <a href="#" className="text-sm font-bold hover:text-white transition-colors">{link.label}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/20">
                    <p>{t('footer_rights')}</p>
                    <p>{t('footer_made_with')}</p>
                </div>
            </div>
        </footer>
    );
}
