import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
// For local demo, we'll allow setting the API key via localStorage or env
const getApiKey = () => localStorage.getItem('groq_api_key') || process.env.NEXT_PUBLIC_GROQ_API_KEY || '';

export interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export type AIPersona = 'neural' | 'analytics' | 'logistics' | 'inventory';

const PERSONA_PROMPTS: Record<AIPersona, string> = {
    neural: `AgriFlow Neural: Primary AI brain. Professional, concise, premium. 
    (FR: Cerveau IA principal. Professionnel, concis, haut de gamme.)`,
    
    analytics: `AgriFlow Analytics: Data scientist for distribution trends and KPIs in Burkina Faso.
    (FR: Scientifique des données pour les tendances de distribution et les indicateurs de performance au Burkina Faso.)`,

    logistics: `AgriFlow Logistics: Operations expert for delivery tracking and route optimization.
    (FR: Expert en opérations pour le suivi des livraisons et l'optimisation des itinéraires.)`,

    inventory: `AgriFlow Inventory: Stock management specialist for seeds and fertilizers.
    (FR: Spécialiste de la gestion des stocks de semences et d'engrais.)`
};

export const getChatCompletion = async (messages: Message[], persona: AIPersona = 'neural') => {
    const apiKey = getApiKey();
    
    if (!apiKey) {
        throw new Error('Groq API Key not found. Please set NEXT_PUBLIC_GROQ_API_KEY or providing it via settings.');
    }

    const basePrompt = PERSONA_PROMPTS[persona];
    const systemPrompt: Message = {
        role: 'system',
        content: `${basePrompt}
        
        ### LANGUAGE RULES:
        1. DETECT the language of the user's latest message.
        2. RESPOND EXCLUSIVELY in that exact same language (e.g. French, English, Spanish, local dialects if understood, etc.).
        3. Do not assume French or English. Match the user's language perfectly.
        4. NEVER mix languages in a single response unless specifically asked.
        
        ### CONTEXT & RULES:
        - CURRENCY: Always use "FCFA".
        - PROJECT: AgriFlow is a digital system for agricultural input distribution in West Africa.
        - TONE: Professional, efficient, and direct.`
    };

    try {
        const response = await axios.post(
            GROQ_API_URL,
            {
                model: 'llama-3.3-70b-versatile',
                messages: [systemPrompt, ...messages],
                temperature: 0.7,
                max_tokens: 1024,
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data.choices[0].message.content;
    } catch (error: unknown) {
        const err = error as any;
        console.error('Groq API Error:', err.response?.data || err.message);
        throw new Error(err.response?.data?.error?.message || 'Failed to connect to Groq AI');
    }
};

export const transcribeAudio = async (audioBlob: Blob) => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error('Groq API Key not found.');

    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('model', 'whisper-large-v3');

    try {
        const response = await axios.post(
            'https://api.groq.com/openai/v1/audio/transcriptions',
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data.text;
    } catch (error: unknown) {
        const err = error as any;
        console.error('Transcription Error:', err.response?.data || err.message);
        throw new Error(err.response?.data?.error?.message || 'Speech recognition failed');
    }
};
