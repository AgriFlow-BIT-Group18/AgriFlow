"use client";

import * as React from "react";
import Image from "next/image";
import { MessageSquare, X, Send, Sparkles, Bot, ArrowRight, User, Languages, 
    Mic, MicOff, Volume2, VolumeX, Plus, Link, FileText, Camera, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrentUser, AuthResponse } from "@/services/authService";

const translations = {
    en: {
        help: "Need help? Ask AgriFlow AI",
        placeholder: "Ask anything...",
        online: "Online",
        common: "Common Queries",
        assistant: "AgriFlow AI",
        initialMsg: "Hello! I am your AgriFlow AI assistant. I can help you track inventory, review orders, or generate distribution reports. How can I assist you today?",
        poweredBy: "Powered by AgriFlow AI Intelligence",
        switch: "Passer au Français",
        recording: "Recording...",
        transcribing: "Transcribing..."
    },
    fr: {
        help: "Besoin d'aide ? Demandez à AgriFlow AI",
        placeholder: "Posez votre question...",
        online: "En ligne",
        common: "Questions fréquentes",
        assistant: "AgriFlow AI",
        initialMsg: "Bonjour ! Je suis votre assistant AgriFlow AI. Je peux vous aider à suivre l'inventaire, examiner les commandes ou générer des rapports de distribution. Comment puis-je vous aider aujourd'hui ?",
        poweredBy: "Propulsé par l'intelligence AgriFlow AI",
        switch: "Switch to English",
        recording: "Enregistrement...",
        transcribing: "Transcription..."
    }
};

export function AIAssistant() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [lang, setLang] = React.useState<"en" | "fr">("fr");
    const [attachments, setAttachments] = React.useState<{ type: 'file' | 'image' | 'link', name: string }[]>([]);
    const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = React.useState(false);
    const [messages, setMessages] = React.useState<{ role: string; content: string; timestamp?: string }[]>([]);
    const [inputValue, setInputValue] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [user, setUser] = React.useState<AuthResponse | null>(null);
    
    // Voice state
    const [isRecording, setIsRecording] = React.useState(false);
    const [isTranscribing, setIsTranscribing] = React.useState(false);
    const [isMuted, setIsMuted] = React.useState(false);
    const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
    const audioChunksRef = React.useRef<Blob[]>([]);

    // Dragging state
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = React.useState(false);
    const dragStartPos = React.useRef({ x: 0, y: 0 });
    const buttonRef = React.useRef<HTMLDivElement>(null);
    const chatEndRef = React.useRef<HTMLDivElement>(null);

    const t = translations[lang];

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(() => {
        // Load user
        try {
            setUser(getCurrentUser());
        } catch (e) {
            console.error("Failed to load user in AIAssistant", e);
        }

        // Initial load
        const savedLang = localStorage.getItem("language") as "en" | "fr";
        if (savedLang && (savedLang === "en" || savedLang === "fr")) {
            setLang(savedLang);
        }
        
        const savedMuted = localStorage.getItem("agriflow_ai_assistant_muted");
        if (savedMuted) setIsMuted(savedMuted === "true");

        const savedPos = localStorage.getItem("agriflow_ai_assistant_pos");
        if (savedPos) {
            try {
                setPosition(JSON.parse(savedPos));
            } catch (e) {
                console.error("Failed to load AI assistant position", e);
            }
        }

        const savedMessages = localStorage.getItem("agriflow_ai_assistant_messages");
        if (savedMessages) {
            try {
                setMessages(JSON.parse(savedMessages));
            } catch (e) {
                console.error("Failed to load AI assistant messages", e);
                setMessages([{ role: "assistant", content: t.initialMsg }]);
            }
        } else {
            setMessages([{ role: "assistant", content: t.initialMsg }]);
        }
    }, [t.initialMsg]);

    React.useEffect(() => {
        scrollToBottom();
        // Save messages on update (but only if we have any)
        if (messages.length > 0) {
            localStorage.setItem("agriflow_ai_assistant_messages", JSON.stringify(messages));
        }
    }, [messages]);

    const toggleLang = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newLang = lang === "en" ? "fr" : "en";
        setLang(newLang);
        localStorage.setItem("language", newLang);
        // If it's just the initial message, translate it
        if (messages.length === 1 && messages[0].role === "assistant") {
            setMessages([{ role: "assistant", content: translations[newLang].initialMsg }]);
        }
    };

    const toggleMute = () => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        localStorage.setItem("agriflow_ai_assistant_muted", String(newMuted));
        if (newMuted) window.speechSynthesis.cancel();
    };

    const speak = (text: string) => {
        if (isMuted) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Detect language for more natural voice
        // Simple detection for start of sentence
        const isFrench = text.toLowerCase().match(/^(bonjour|je|votre|examen|commande|merci)/i);
        utterance.lang = isFrench ? "fr-FR" : "en-US";
        
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => 
            v.lang.startsWith(utterance.lang) && 
            (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Premium"))
        );
        if (preferredVoice) utterance.voice = preferredVoice;
        
        window.speechSynthesis.speak(utterance);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setIsTranscribing(true);
                try {
                    const { transcribeAudio } = await import("@/services/aiService");
                    const text = await transcribeAudio(audioBlob);
                    if (text) {
                        setInputValue(text);
                    }
                } catch (err: unknown) {
                    console.error(err);
                } finally {
                    setIsTranscribing(false);
                }
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Microphone access denied", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
        }
    };

    const handleSend = async (customValue?: string) => {
        const text = customValue || inputValue;
        if ((!text.trim() && attachments.length === 0) || isLoading) return;

        const attachmentInfo = attachments.length > 0 
            ? `\n\n[${lang === "en" ? "Attachments" : "Pièces jointes"}: ${attachments.map(a => a.name).join(', ')}]` 
            : "";

        const newUserMsg = {
            role: "user",
            content: text.trim() + attachmentInfo,
            timestamp: new Date().toISOString()
        };
        const newMessages = [...messages, newUserMsg];
        setMessages(newMessages);
        setInputValue("");
        setIsLoading(true);

        try {
            const { getChatCompletion } = await import("@/services/aiService");
            const chatHistory = newMessages.map(m => ({
                role: m.role as 'user' | 'assistant' | 'system',
                content: m.content
            }));
            
            const aiResponse = await getChatCompletion(chatHistory);
            
            setMessages(prev => [...prev, {
                role: "assistant",
                content: aiResponse
            }]);
            speak(aiResponse);
        } catch (error: unknown) {
            const err = error as Error;
            setMessages(prev => [...prev, {
                role: "assistant",
                content: lang === "en" 
                    ? `Error: ${err.message}.`
                    : `Erreur : ${err.message}.`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Drag Handlers
    const onMouseDown = (e: React.MouseEvent) => {
        if (isOpen) return;
        setIsDragging(true);
        dragStartPos.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
    };

    React.useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            
            // Apply constraints to keep the bubble within the viewport
            const padding = 20;
            let newX = e.clientX - dragStartPos.current.x;
            let newY = e.clientY - dragStartPos.current.y;
            
            // Constrain X (relative to right anchor)
            // The button is anchored at right: 24px. 
            // So newX < 0 moves it left, newX > 0 moves it right.
            // Screen Width - 24 (right) - 50 (width) = approx limit for moving left.
            const screenW = window.innerWidth;
            const screenH = window.innerHeight;
            
            // Limit left (x < -(screenW - 100))
            if (newX < -(screenW - 100)) newX = -(screenW - 100);
            // Limit right (x > 0 since it starts at right 24px)
            if (newX > 0) newX = 0;
            
            // Constrain Y (relative to bottom anchor)
            // Level 0 is bottom 24px. newY < 0 moves it up, newY > 0 moves it down.
            // Limit up (y < -(screenH - 100))
            if (newY < -(screenH - 100)) newY = -(screenH - 100);
            // Limit down (y > 0)
            if (newY > 0) newY = 0;
            
            setPosition({ x: newX, y: newY });
        };

        const onMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                localStorage.setItem("ai_assistant_pos", JSON.stringify(position));
            }
        };

        if (isDragging) {
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [isDragging, position]);

    const suggestions = lang === "en" ? [
        "Review pending orders",
        "Check stock levels",
        "Country distribution trends",
        "Generate weekly report"
    ] : [
        "Examiner les commandes en attente",
        "Vérifier les niveaux de stock",
        "Tendances de distribution par pays",
        "Générer le rapport hebdomadaire"
    ];

    return (
        <div 
            ref={buttonRef}
            className="fixed z-50 flex flex-col items-end touch-none max-w-[calc(100vw-32px)] sm:max-w-none"
            style={{ 
                bottom: "24px", 
                right: "24px",
                transform: `translate(${position.x}px, ${position.y}px)`,
                cursor: isDragging ? "grabbing" : (isOpen ? "default" : "grab")
            }}
        >
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 flex h-[500px] w-full max-w-[380px] sm:w-[380px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-auto cursor-default">
                    {/* Header */}
                    <div className="flex items-center justify-between bg-primary p-4 text-white">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                <Bot size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-bold">{t.assistant}</p>
                                <div className="flex items-center gap-1">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">{t.online}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={toggleMute} className="rounded-lg p-2 hover:bg-white/10 transition-colors">
                                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            </button>
                            <button 
                                onClick={toggleLang}
                                title={t.switch}
                                className="rounded-lg p-2 hover:bg-white/10 transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider"
                            >
                                <Languages size={16} />
                                {lang === "en" ? "FR" : "EN"}
                            </button>
                            <button onClick={() => setIsOpen(false)} className="rounded-lg p-2 hover:bg-white/10 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
                        {messages.map((msg, idx) => msg.content && (
                            <div key={idx} className={cn(
                                "flex gap-3",
                                msg.role === "user" ? "flex-row-reverse" : "flex-row"
                            )}>
                                <div className={cn(
                                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm border overflow-hidden",
                                    msg.role === "assistant" ? "bg-primary text-white border-primary" : "bg-white text-text-secondary border-gray-200"
                                )}>
                                    {msg.role === "assistant" ? (
                                        <Sparkles size={14} />
                                    ) : (
                                        user?.avatar ? (
                                            <div className="relative h-full w-full">
                                                <Image 
                                                    src={user.avatar.startsWith('http') ? user.avatar : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${user.avatar}`} 
                                                    alt={user.name} 
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <User size={14} />
                                        )
                                    )}
                                </div>
                                <div className={cn(
                                    "rounded-2xl p-3 text-sm shadow-sm max-w-[80%]",
                                    msg.role === "assistant"
                                        ? "bg-white text-text-primary border border-gray-100 rounded-tl-none"
                                        : "bg-primary text-white rounded-tr-none"
                                )}>
                                    <div className="leading-relaxed whitespace-pre-wrap space-y-2">
                                        {msg.content.split('\n').map((line: string, i: number) => {
                                            // Simple Markdown-lite: bolding with **
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
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white border border-primary shadow-sm">
                                    <Sparkles size={14} className="animate-spin" />
                                </div>
                                <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100 rounded-tl-none flex gap-1 items-center">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce" />
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0.2s]" />
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />

                        {/* Suggestions */}
                        {messages.length <= 1 && !isLoading && (
                            <div className="grid grid-cols-1 gap-2 pt-4 animate-in fade-in slide-up-from-bottom-2 duration-500">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary px-1 mb-1">{t.common}</p>
                                {suggestions.map((s, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSend(s)}
                                        className="flex items-center justify-between rounded-xl bg-white border border-gray-100 p-3 text-left text-xs font-semibold text-text-primary hover:border-primary hover:bg-primary/5 hover:text-primary transition-all shadow-sm group active:scale-[0.98]"
                                    >
                                        <span className="flex-1 pr-2">{s}</span>
                                        <ArrowRight size={14} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="border-t bg-white p-4 relative">
                        {isTranscribing && (
                            <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-200">
                                <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20 shadow-sm animate-bounce-subtle">
                                    <Sparkles size={14} className="animate-spin" />
                                    <span className="text-xs font-bold uppercase tracking-wider">{t.transcribing}</span>
                                </div>
                            </div>
                        )}
                        
                        {isRecording && (
                            <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-status-rejected animate-pulse">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-status-rejected shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                    {t.recording}
                                </div>
                                <span className="opacity-60">Tap Mic to stop</span>
                            </div>
                        )}

                        {/* Attachment Previews */}
                        {attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2 px-1">
                                {attachments.map((at, i) => (
                                    <div key={i} className="flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full px-2.5 py-1 text-[10px] font-bold animate-in fade-in zoom-in duration-200">
                                        {at.type === 'image' ? <ImageIcon size={12} /> : at.type === 'link' ? <Link size={12} /> : <FileText size={12} />}
                                        <span className="max-w-[80px] truncate">{at.name}</span>
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

                        <div className={cn(
                            "flex items-center gap-2 rounded-xl border px-3 py-1 transition-all duration-200",
                            isRecording 
                                ? "bg-status-rejected/5 border-status-rejected/30 ring-1 ring-status-rejected/20" 
                                : "bg-gray-50 border-gray-200 focus-within:ring-1 focus-within:ring-primary focus-within:bg-white focus-within:border-primary/30"
                        )}>
                            <div className="relative">
                                {/* Attachment Menu */}
                                {isAttachmentMenuOpen && (
                                    <div className="absolute bottom-full mb-4 left-0 w-44 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 animate-in fade-in slide-in-from-bottom-4 duration-300 z-20">
                                        <input 
                                            type="file" 
                                            id="ai-file-upload" 
                                            className="hidden" 
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const formData = new FormData();
                                                    formData.append('file', file);
                                                    try {
                                                        const api = (await import("@/services/api")).default;
                                                        const response = await api.post('/upload/ai', formData, {
                                                            headers: { 'Content-Type': 'multipart/form-data' }
                                                        });
                                                        setAttachments(prev => [...prev, { 
                                                            type: response.data.type, 
                                                            name: response.data.name,
                                                            url: response.data.url 
                                                        }]);
                                                    } catch (err) {
                                                        console.error("AI upload failed:", err);
                                                    }
                                                }
                                                setIsAttachmentMenuOpen(false);
                                            }}
                                        />
                                        <button 
                                            onClick={() => document.getElementById('ai-file-upload')?.click()}
                                            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-background-alt text-text-primary transition-all group"
                                        >
                                            <div className="h-7 w-7 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                                <FileText size={14} />
                                            </div>
                                            <span className="text-[11px] font-bold">File / Photo</span>
                                        </button>
                                        <button 
                                            onClick={() => {
                                                const url = prompt("Enter URL:");
                                                if (url) setAttachments(prev => [...prev, { type: 'link', name: url.replace(/^https?:\/\/(www\.)?/, '') }]);
                                                setIsAttachmentMenuOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-background-alt text-text-primary transition-all group"
                                        >
                                            <div className="h-7 w-7 flex items-center justify-center rounded-lg bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                                <Link size={14} />
                                            </div>
                                            <span className="text-[11px] font-bold">Link</span>
                                        </button>
                                    </div>
                                )}
                                
                                <button 
                                    onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
                                    className={cn(
                                        "p-1.5 rounded-lg transition-all duration-300",
                                        isAttachmentMenuOpen ? "text-white bg-primary shadow-lg" : "text-text-secondary hover:text-primary hover:bg-primary/5"
                                    )}
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            <button 
                                onClick={isRecording ? stopRecording : startRecording}
                                className={cn(
                                    "p-1.5 rounded-lg transition-all duration-300",
                                    isRecording 
                                        ? "text-white bg-status-rejected shadow-lg scale-110" 
                                        : "text-text-secondary hover:text-primary hover:bg-primary/5 active:scale-90"
                                )}
                            >
                                {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                            </button>
                            <input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSend();
                                        setAttachments([]);
                                    }
                                    if (e.key === "Escape") setIsAttachmentMenuOpen(false);
                                }}
                                placeholder={t.placeholder}
                                disabled={isTranscribing}
                                className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-gray-400 disabled:opacity-50"
                            />
                            <button
                                onClick={() => {
                                    handleSend();
                                    setAttachments([]);
                                }}
                                disabled={(!inputValue.trim() && attachments.length === 0) || isLoading || isTranscribing}
                                className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white disabled:opacity-30 disabled:grayscale transition-all shadow-md active:scale-95 enabled:hover:shadow-lg enabled:hover:scale-105"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                        <p className="mt-2 text-center text-[10px] text-gray-400 font-medium tracking-wide uppercase opacity-70 italic">{t.poweredBy}</p>
                    </div>
                </div>
            )}

            {/* Trigger Button */}
            <div 
                onMouseDown={onMouseDown}
                onClick={isOpen ? undefined : () => setIsOpen(true)}
                className={cn(
                    "group relative flex items-center h-[56px] px-4 rounded-full shadow-2xl transition-all duration-300 active:scale-95 border border-white/20 select-none overflow-hidden",
                    isOpen ? "w-[56px] bg-white text-primary" : "w-[56px] translate-x-[calc(50vw-52px)] sm:translate-x-0 sm:w-auto bg-primary text-white hover:bg-primary-dark"
                )}
            >
                {/* Floating shine effect */}
                <div className="absolute inset-x-0 h-full w-2 bg-white/20 -skew-x-12 animate-shine pointer-events-none" />
                
                <div className="relative flex items-center justify-center h-full">
                    {isOpen ? <X size={24} /> : <Bot size={24} className="animate-bounce-subtle" />}
                </div>
                
                {!isOpen && (
                    <div className="ml-3 sm:block hidden">
                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 leading-none mb-0.5">{lang === 'en' ? 'Need help?' : "Besoin d'aide ?"}</p>
                        <p className="text-sm font-extrabold whitespace-nowrap leading-none">{lang === 'en' ? 'Ask AgriFlow AI' : 'Demander à AgriFlow IA'}</p>
                    </div>
                )}
            </div>

        </div>
    );
}
