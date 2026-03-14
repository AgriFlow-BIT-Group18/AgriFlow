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
        LANGUAGE INSTRUCTION: You must detect the language used by the user in their latest message and respond in that SAME language (English or French). 
        If the user speaks French, your entire response MUST be in French. If English, entire response in English.
        CURRENCY: Always use "FCFA".
        CONTEXT: AgriFlow is a digital system for agricultural input distribution in West Africa.`
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
    } catch (error: any) {
        console.error('Groq API Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error?.message || 'Failed to connect to Groq AI');
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
    } catch (error: any) {
        console.error('Transcription Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error?.message || 'Speech recognition failed');
    }
};
