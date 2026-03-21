"use client";

import * as React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/Button";
import { LayoutGrid, ArrowRight, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function Products() {
    const { t } = useTranslation();
    const [activeIndex, setActiveIndex] = React.useState(0);

    const products = [
        {
            title: t('product_1_title'),
            desc: t('product_1_desc'),
            image: "/images/product-seed.png",
            tag: t('active')
        },
        {
            title: t('product_2_title'),
            desc: t('product_2_desc'),
            image: "/images/product-fertilizer.png",
            tag: t('active')
        },
        {
            title: t('product_3_title'),
            desc: t('product_3_desc'),
            image: "/images/product-pesticide.png",
            tag: t('active')
        },
        {
            title: t('product_4_title'),
            desc: t('product_4_desc'),
            image: "/images/product-irrigation.png",
            tag: t('active')
        }
    ];

    const next = () => setActiveIndex((prev) => (prev + 1) % products.length);
    const prev = () => setActiveIndex((prev) => (prev - 1 + products.length) % products.length);

    return (
        <section id="products" className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 text-center md:text-left">
                    <div className="space-y-4 max-w-2xl mx-auto md:mx-0">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-black tracking-widest uppercase border border-primary/10">
                            <ShieldCheck size={14} /> {t('only_for_distributors')}
                        </div>
                        <h2 className="text-sm font-bold text-primary uppercase tracking-widest">{t('products_badge')}</h2>
                        <h3 className="text-4xl lg:text-5xl font-black text-text-primary leading-tight">
                            {t('products_title')}
                        </h3>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={prev} className="h-14 w-14 rounded-full border-2 border-gray-100 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                            <ChevronLeft size={24} />
                        </button>
                        <button onClick={next} className="h-14 w-14 rounded-full border-2 border-gray-100 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <div className="flex transition-transform duration-700 ease-out gap-8" style={{ transform: `translateX(-${activeIndex * (100 / (typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 2))}%)` }}>
                        {products.map((p, i) => (
                            <div 
                                key={i} 
                                className={cn(
                                    "min-w-full md:min-w-[calc(50%-16px)] group relative rounded-[3rem] bg-gray-50 overflow-hidden border border-gray-100 flex flex-col shadow-sm hover:shadow-2xl transition-all duration-500",
                                    activeIndex === i ? "opacity-100 scale-100" : "opacity-40 scale-95"
                                )}
                            >
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <img 
                                        src={p.image} 
                                        alt={p.title} 
                                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="p-10 space-y-6">
                                    <div className="space-y-2">
                                        <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{p.tag}</div>
                                        <h4 className="text-3xl font-black text-text-primary">{p.title}</h4>
                                        <p className="text-text-secondary font-medium leading-relaxed">{p.desc}</p>
                                    </div>
                                    <Button variant="outline" className="h-12 border-2 px-8 font-black gap-2 hover:bg-primary hover:text-white hover:border-primary">
                                        <LayoutGrid size={18} /> {t('manage_inventory')}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Pagination Dots */}
                <div className="flex justify-center gap-3 mt-12">
                    {products.map((_, i) => (
                        <button 
                            key={i} 
                            onClick={() => setActiveIndex(i)}
                            className={cn(
                                "h-2 transition-all duration-300 rounded-full",
                                activeIndex === i ? "w-12 bg-primary" : "w-2 bg-gray-200"
                            )}
                        />
                    ))}
                </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
        </section>
    );
}
