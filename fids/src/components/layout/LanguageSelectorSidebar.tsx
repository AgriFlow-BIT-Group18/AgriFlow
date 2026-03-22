"use client";

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';
import { Globe } from 'lucide-react';

export const LanguageSelectorSidebar: React.FC = () => {
    const { language, setLanguage, languages } = useTranslation();

    return (
        <div className="px-4 py-2 mt-2">
            <div className="flex items-center gap-2 mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <Globe size={12} />
                <span>Language</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => {
                    const isSelected = language === lang.code;
                    return (
                        <button
                            key={lang.code}
                            onClick={() => setLanguage(lang.code)}
                            className={cn(
                                "flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200",
                                isSelected
                                    ? "bg-primary text-white shadow-sm"
                                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5"
                            )}
                        >
                            <span className="text-sm">{lang.flag}</span>
                            <span>{lang.code.toUpperCase()}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
