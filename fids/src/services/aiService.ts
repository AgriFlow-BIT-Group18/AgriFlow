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
    neural: `You are AgriFlow Neural, the primary AI brain for the AgriFlow platform. 
    Your goal is to provide general oversight and help users navigate the platform's features.
    Be professional, helpful, and concise. Tone: Premium and efficient.`,
    
    analytics: `You are AgriFlow Analytics, a specialized data scientist for the AgriFlow platform.
    Your expertise is in regional distribution trends, KPIs, and statistical auditing.
    Help users interpret reports and find growth opportunities in Burkina Faso.`,

    logistics: `You are AgriFlow Logistics, the operations expert for AgriFlow.
    You specialize in delivery tracking, route optimization, and distributor coordination.
    Your focus is on ensuring efficient delivery of inputs to farmers in every region.`,

    inventory: `You are AgriFlow Inventory, the stock management specialist for AgriFlow.
    You focus on seed and fertilizer levels, threshold alerts, and input procurement.
    Help users ensure no region runs out of essential agricultural supplies.`
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
        IMPORTANT: Always respond in the SAME LANGUAGE as the user's question (e.g., if asked in French, respond in French).
        CURRENCY: Always use "FCFA" for prices and financial data.
        Project Context: AgriFlow is a system for digital agricultural input distribution.`
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
