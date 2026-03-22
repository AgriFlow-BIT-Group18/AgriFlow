"use client";

import * as React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Plus, Box, 
    ImageIcon, Link, FileText, Camera, X,
    Send, Sparkles, Bot, User, Mic, BarChart3, Truck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { AIPersona } from "@/services/aiService";

const PERSONAS: { id: AIPersona, name: string, sub: string, icon: React.ElementType, color: string, desc: string, welcome: string }[] = [
    { 
        id: 'neural', 
        name: 'AgriFlow Neural', 
        sub: 'Neural Active', 
        icon: Bot, 
        color: 'bg-primary',
        desc: 'Primary system oversight and general assistance.',
        welcome: 'Hello! I am AgriFlow Neural. I oversee the entire platform operations. How can I assist you today?'
    },
    { 
        id: 'analytics', 
        name: 'AgriFlow Analytics', 
        sub: 'Data Scientist', 
        icon: BarChart3, 
        color: 'bg-blue-600',
        desc: 'Expert in reports, trends, and regional performance.',
        welcome: 'Greetings. I am AgriFlow Analytics. Ready to dive into your distribution data and find some insights?'
    },
    { 
        id: 'logistics', 
        name: 'AgriFlow Logistics', 
        sub: 'Operations Manager', 
        icon: Truck, 
        color: 'bg-orange-600',
        desc: 'Specialized in delivery tracking and route optimization.',
        welcome: 'Logistics lead here. Need help tracking a delivery or optimizing a route across Burkina Faso?'
    },
    { 
        id: 'inventory', 
        name: 'AgriFlow Inventory', 
        sub: 'Stock Specialist', 
        icon: Box, 
        color: 'bg-purple-600',
        desc: 'Focused on stock levels and procurement alerts.',
        welcome: 'Inventory Specialist reporting. Which seed or fertilizer levels should we check today?'
    }
];



export default function AIPage() {
    const [messages, setMessages] = React.useState<{
        role: "assistant" | "user";
        content: string;
        timestamp: string;
    }[]>([]);
    const [persona, setPersona] = React.useState<AIPersona>("neural");
    const [isPersonaModalOpen, setIsPersonaModalOpen] = React.useState(false);
    const [attachments, setAttachments] = React.useState<{ type: 'file' | 'image' | 'link', name: string }[]>([]);
    const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const activePersona = PERSONAS.find(p => p.id === persona) || PERSONAS[0];

    // Persistence: Load
    React.useEffect(() => {
        const key = `agriflow_ai_messages_${persona}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                setMessages(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse saved messages", e);
            }
        } else {
            // Default initial message
            setMessages([
                {
                    role: "assistant",
                    content: activePersona.welcome,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        }
    }, [persona, activePersona.welcome]);

    // Persistence: Save
    React.useEffect(() => {
        if (messages.length > 0) {
            const key = `agriflow_ai_messages_${persona}`;
            localStorage.setItem(key, JSON.stringify(messages));
        }
    }, [messages, persona]);

    const scrollToBottom = (instant = false) => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ 
                behavior: instant ? "auto" : "smooth",
                block: "end"
            });
        }
    };

    React.useEffect(() => {
        // Small delay to ensure DOM is updated and layout stable
        const timer = setTimeout(() => scrollToBottom(), 100);
        return () => clearTimeout(timer);
    }, [messages, isLoading]);

    const handleSend = async (customValue?: string) => {
        const text = customValue || inputValue;
        if (!text.trim() && attachments.length === 0) return;

        const attachmentInfo = attachments.length > 0 
            ? `\n\n[Attachments: ${attachments.map(a => a.name).join(', ')}]` 
            : "";
            
        const userMsg = {
            role: "user" as const,
            content: text.trim() + attachmentInfo,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInputValue("");
        setIsLoading(true);

        try {
            const { getChatCompletion } = await import("@/services/aiService");
            const chatHistory = newMessages.map(m => ({
                role: m.role as 'user' | 'assistant' | 'system',
                content: m.content
            }));
            
            const aiResponse = await getChatCompletion(chatHistory, persona);
            
            setMessages(prev => [...prev, {
                role: "assistant",
                content: aiResponse,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } catch (error: unknown) {
            const err = error as Error;
            setMessages(prev => [...prev, {
                role: "assistant",
                content: `Error: ${err.message}. Please check your connection or API key.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearHistory = () => {
        if (confirm(`Are you sure you want to clear your conversation history with ${activePersona.name}?`)) {
            const key = `agriflow_ai_messages_${persona}`;
            localStorage.removeItem(key);
            setMessages([
                {
                    role: "assistant",
                    content: `History cleared for ${activePersona.name}. How can I help you now?`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        }
    };

    const insights = [
        { title: "Inventory Alert", desc: "Urea Fertilizer is low in Saint-Louis", type: "warning" },
        { title: "Demand Surge", desc: "Projected 20% increase in Maize Seeds", type: "info" },
        { title: "Efficiency Boost", desc: "Route optimization for delivery #TRK-88", type: "success" }
    ];

    return (
        <DashboardLayout>
            <div className="flex h-full lg:h-[calc(100vh-140px)] flex-col gap-6 overflow-hidden lg:flex-row">
                {/* Main Chat Area */}
                <div className="flex flex-1 flex-col rounded-3xl bg-white shadow-sm ring-1 ring-black/5 overflow-hidden min-h-[500px]">
                    {/* Chat Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-8 sm:py-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className={cn("flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl text-white shadow-lg", activePersona.color)}>
                                <activePersona.icon size={24} className="sm:hidden" />
                                <activePersona.icon size={28} className="hidden sm:block" />
                            </div>
                            <div>
                                <h1 className="text-base sm:text-lg font-bold text-text-primary leading-tight">{activePersona.name}</h1>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-green-500"></span>
                                    </span>
                                    <span className="text-[9px] sm:text-xs font-bold text-text-secondary uppercase tracking-widest whitespace-nowrap">{activePersona.sub}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-1.5 sm:gap-2">
                            <Button variant="outline" size="sm" className="h-8 text-[10px] sm:h-10 sm:text-xs">Export</Button>
                            <Button variant="ghost" size="sm" className="h-8 text-[10px] sm:h-10 sm:text-xs text-status-rejected" onClick={clearHistory}>Clear</Button>
                        </div>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 sm:p-8 space-y-4 sm:space-y-6">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={cn(
                                "flex gap-3 sm:gap-4 max-w-full sm:max-w-4xl",
                                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto flex-row"
                            )}>
                                <div className={cn(
                                    "flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl shadow-md border",
                                    msg.role === "assistant" ? "bg-primary text-white border-primary" : "bg-white text-text-secondary border-gray-200"
                                )}>
                                    {msg.role === "assistant" ? <Sparkles size={16} className="sm:hidden" /> : <User size={16} className="sm:hidden" />}
                                    {msg.role === "assistant" ? <Sparkles size={18} className="hidden sm:block" /> : <User size={18} className="hidden sm:block" />}
                                </div>
                                <div className="space-y-1 max-w-[85%] sm:max-w-none">
                                    <div className={cn(
                                        "rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4 text-xs sm:text-sm shadow-sm",
                                        msg.role === "assistant"
                                            ? "bg-white text-text-primary border border-gray-100 rounded-tl-none"
                                            : "bg-primary text-white rounded-tr-none"
                                    )}>
                                        <div className="leading-relaxed whitespace-pre-wrap space-y-2">
                                            {msg.content.split('\n').map((line: string, i: number) => {
                                                const parts = line.split(/(\*\*.*?\*\*)/g);
                                                return (
                                                    <p key={i}>
                                                        {parts.map((part: string, j: number) => {
                                                            if (part.startsWith('**') && part.endsWith('**')) {
                                                                return <strong key={j} className="font-bold text-primary">{part.slice(2, -2)}</strong>;
                                                            }
                                                            return part;
                                                        })}
                                                    </p>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <p className={cn(
                                        "text-[9px] font-bold text-text-secondary uppercase tracking-tighter",
                                        msg.role === "user" ? "text-right" : "text-left"
                                    )}>
                                        {msg.timestamp}
                                    </p>
                                </div>
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className="flex gap-4 mr-auto animate-in fade-in slide-in-from-left-2 duration-300">
                                <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-primary text-white border border-primary shadow-md">
                                    <Sparkles size={16} className="animate-spin" />
                                </div>
                                <div className="rounded-xl sm:rounded-2xl bg-white px-4 py-3 sm:px-6 sm:py-4 shadow-sm border border-gray-100 rounded-tl-none flex gap-1 items-center">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" />
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0.2s]" />
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Interface */}
                    <div className="border-t bg-white p-4 sm:p-6 relative">
                        <div className="relative flex flex-col gap-3 sm:gap-4">
                            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                                {["Stocks", "Distribution", "Predict", "Export"].map((s, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => handleSend(s)} 
                                        disabled={isLoading}
                                        className="rounded-full bg-background-alt px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-bold text-text-secondary hover:bg-primary/10 hover:text-primary transition-all border border-gray-100 active:scale-95 disabled:opacity-50"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                            {/* Attachment Previews */}
                            {attachments.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2 px-1">
                                    {attachments.map((at, i) => (
                                        <div key={i} className="flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-1 text-[10px] font-bold animate-in fade-in zoom-in duration-200">
                                            {at.type === 'image' ? <ImageIcon size={12} /> : at.type === 'link' ? <Link size={12} /> : <FileText size={12} />}
                                            <span className="max-w-[100px] truncate">{at.name}</span>
                                            <button 
                                                onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                                                className="hover:text-status-rejected transition-colors pl-1 border-l border-primary/20 ml-1"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-end gap-2 sm:gap-3 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-200 p-2 sm:p-3 focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white transition-all shadow-inner">
                                <div className="relative flex flex-col gap-1 sm:gap-2 pb-1">
                                    {/* Attachment Menu */}
                                    {isAttachmentMenuOpen && (
                                        <div className="absolute bottom-full mb-4 left-0 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 animate-in fade-in slide-in-from-bottom-4 duration-300 z-20">
                                            <div className="p-2 mb-1 border-b border-gray-50">
                                                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Attach Content</p>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    setAttachments(prev => [...prev, { type: 'file', name: 'Stock_Report.pdf' }]);
                                                    setIsAttachmentMenuOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-background-alt text-text-primary transition-all group"
                                            >
                                                <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                                    <FileText size={16} />
                                                </div>
                                                <span className="text-xs font-bold">Upload File</span>
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setAttachments(prev => [...prev, { type: 'image', name: 'Field_Photo.jpg' }]);
                                                    setIsAttachmentMenuOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-background-alt text-text-primary transition-all group"
                                            >
                                                <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-green-50 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all">
                                                    <Camera size={16} />
                                                </div>
                                                <span className="text-xs font-bold">Take Photo</span>
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    const url = prompt("Enter link URL:");
                                                    if (url) setAttachments(prev => [...prev, { type: 'link', name: url.replace(/^https?:\/\/(www\.)?/, '') }]);
                                                    setIsAttachmentMenuOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-background-alt text-text-primary transition-all group"
                                            >
                                                <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                                    <Link size={16} />
                                                </div>
                                                <span className="text-xs font-bold">Add Link</span>
                                            </button>
                                        </div>
                                    )}

                                    <button 
                                        onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
                                        className={cn(
                                            "flex items-center justify-center rounded-lg transition-all p-1",
                                            isAttachmentMenuOpen ? "bg-primary text-white scale-110 shadow-lg" : "text-text-secondary hover:text-primary hover:bg-primary/5"
                                        )}
                                    >
                                        <Plus size={18} className="sm:hidden" />
                                        <Plus size={20} className="hidden sm:block" />
                                    </button>
                                </div>
                                <textarea
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => { 
                                        if (e.key === 'Enter' && !e.shiftKey) { 
                                            e.preventDefault(); 
                                            handleSend(); 
                                        } 
                                        if (e.key === 'Escape') setIsAttachmentMenuOpen(false);
                                    }}
                                    placeholder="Ask anything..."
                                    className="flex-1 bg-transparent py-2 text-xs sm:text-sm outline-none placeholder:text-gray-400 resize-none max-h-32 min-h-[40px] sm:min-h-[44px]"
                                    rows={1}
                                />
                                <div className="flex gap-1.5 sm:gap-2">
                                    <button className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg sm:rounded-xl text-text-secondary hover:bg-gray-100 transition-colors"><Mic size={18} className="sm:hidden" /><Mic size={22} className="hidden sm:block" /></button>
                                    <button
                                        onClick={() => {
                                            handleSend();
                                            setAttachments([]);
                                        }}
                                        disabled={(!inputValue.trim() && attachments.length === 0) || isLoading}
                                        className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-lg sm:rounded-xl bg-primary text-white disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-primary/20 active:scale-95"
                                    >
                                        <Send size={18} className="sm:hidden" />
                                        <Send size={20} className="hidden sm:block" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Insights */}
                <div className="w-full lg:w-80 space-y-4 sm:space-y-6">
                    <div className="rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-sm ring-1 ring-black/5">
                        <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-text-secondary mb-4 sm:mb-6 flex items-center gap-2">
                            <Sparkles size={14} className="text-primary" /> Live Insights
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
                            {insights.map((insight, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => handleSend(`Apply ${insight.title.toLowerCase()} : ${insight.desc}`)}
                                    className="group cursor-pointer rounded-xl sm:rounded-2xl border border-gray-100 p-3 sm:p-4 transition-all hover:bg-background-alt hover:border-primary/20"
                                >
                                    <p className={cn(
                                        "text-[9px] sm:text-[10px] font-bold uppercase tracking-tighter mb-1",
                                        insight.type === 'warning' ? 'text-status-rejected' : insight.type === 'success' ? 'text-primary' : 'text-blue-500'
                                    )}>
                                        {insight.title}
                                    </p>
                                    <p className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{insight.desc}</p>
                                </div>
                            ))}
                        </div>
                        <Button 
                            variant="ghost" 
                            className="w-full mt-4 sm:mt-6 text-[10px] sm:text-xs gap-2"
                            onClick={() => setIsPersonaModalOpen(true)}
                        >
                            View All Intelligence <ArrowRight size={14} />
                        </Button>
                    </div>

                    <div className={cn("rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden group transition-all duration-500", activePersona.color)}>
                        <div className="relative z-10">
                            <activePersona.icon size={28} className="mb-2 sm:mb-4 text-white/80 sm:hidden" />
                            <activePersona.icon size={32} className="mb-4 text-white/80 hidden sm:block" />
                            <h4 className="text-base sm:text-lg font-extrabold mb-1">{activePersona.name}</h4>
                            <p className="text-[10px] sm:text-xs text-white/70 leading-relaxed font-medium">{activePersona.desc}</p>
                        </div>
                        <div className="absolute top-[-20px] right-[-20px] h-32 w-32 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                    </div>
                </div>
            </div>

            {/* Persona Selection Modal */}
            <Modal
                isOpen={isPersonaModalOpen}
                onClose={() => setIsPersonaModalOpen(false)}
                title="AgriFlow Intelligence Core"
                className="max-w-2xl"
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                    {PERSONAS.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => {
                                setPersona(p.id);
                                setIsPersonaModalOpen(false);
                            }}
                            className={cn(
                                "flex flex-col items-start p-6 rounded-2xl border-2 transition-all text-left group",
                                persona === p.id 
                                    ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
                                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                            )}
                        >
                            <div className={cn(
                                "h-12 w-12 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform",
                                p.color
                            )}>
                                <p.icon size={24} />
                            </div>
                            <h3 className="font-bold text-text-primary group-hover:text-primary transition-colors">{p.name}</h3>
                            <p className="text-xs text-text-secondary mt-1">{p.desc}</p>
                            <div className="mt-4 flex items-center gap-2">
                                <span className={cn(
                                    "h-2 w-2 rounded-full",
                                    persona === p.id ? "bg-green-500 animate-pulse" : "bg-gray-300"
                                )} />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                                    {persona === p.id ? "Connected" : "Load Core"}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </Modal>
        </DashboardLayout>
    );
}
