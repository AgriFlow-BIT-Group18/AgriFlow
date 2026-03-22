"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  variant?: 'default' | 'landing';
  isScrolled?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'default',
  isScrolled = false 
}) => {
  const { language, setLanguage, languages, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLanguages = languages.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all border border-transparent shadow-sm",
          variant === 'default' 
            ? "bg-gray-100/50 hover:bg-gray-100 hover:border-gray-200" 
            : cn(
                "hover:border-white/20",
                isScrolled 
                  ? "bg-gray-100/50 text-text-primary hover:bg-gray-100" 
                  : "bg-white/10 text-white hover:bg-white/20"
              )
        )}
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="text-sm font-semibold uppercase">{currentLang.code}</span>
        <ChevronDown size={14} className={cn("transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in duration-200">
          <div className="bg-gray-950 p-4 text-white">
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('search_language')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg bg-white/10 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1">
              {filteredLanguages.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                    {isSelected && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                        <Check size={12} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

             <button
                onClick={() => setIsOpen(false)}
                className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-bold text-white transition-transform active:scale-95"
             >
              Sauvegarder
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
