import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
// For local demo, we'll allow setting the API key via localStorage or env
const getApiKey = () => localStorage.getItem('groq_api_key') || process.env.NEXT_PUBLIC_GROQ_API_KEY || '';

export interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string | any[];
}

export type AIPersona = 'neural' | 'analytics' | 'logistics' | 'inventory';

const PERSONA_PROMPTS: Record<AIPersona, string> = {
    neural: `AgriFlow Neural: Primary system brain. Professional and concise oversight. You can see and analyze images.`,
    
    analytics: `AgriFlow Analytics: Data scientist for trends and KPIs. Expert in statistics. You can see and analyze charts or data images.`,

    logistics: `AgriFlow Logistics: Operations expert for delivery tracking and route optimization. You can see and analyze maps or delivery photos.`,

    inventory: `AgriFlow Inventory: Stock management specialist for seeds and fertilizers. You can see and analyze warehouse photos.`
};

export const getChatCompletion = async (messages: Message[], persona: AIPersona = 'neural', images?: string[]) => {
    const apiKey = getApiKey();
    
    if (!apiKey) {
        throw new Error('Groq API Key not found. Please set NEXT_PUBLIC_GROQ_API_KEY or providing it via settings.');
    }

    const basePrompt = PERSONA_PROMPTS[persona];
    const systemPrompt: Message = {
        role: 'system',
        content: `### IDENTITY:
        ${basePrompt}
        
        ### CRITICAL LANGUAGE RULE:
        - ALWAYS detect the language of the user's message.
        - ALWAYS respond in that SAME EXACT language (English, French, Spanish, Portuguese, etc.).
        - If the user switches languages, YOU switch immediately.
        - DO NOT assume a default language based on the project location (Burkina Faso).
        
        ### CONTEXT:
        - AgriFlow: Digital agricultural distribution system.
        - Currency: Always use "FCFA".
        - Tone: Professional, concise, direct.`
    };

    // Use vision model if images are present, otherwise stick to faster text model
    const model = images && images.length > 0 ? 'meta-llama/llama-4-scout-17b-16e-instruct' : 'llama-3.1-8b-instant';
    
    const formattedMessages = [...messages];
    if (images && images.length > 0) {
        const lastMsg = formattedMessages[formattedMessages.length - 1];
        if (lastMsg.role === 'user') {
            const content: any[] = [{ type: 'text', text: lastMsg.content as string }];
            images.forEach(img => {
                content.push({
                    type: 'image_url',
                    image_url: { url: img.startsWith('data:') ? img : `data:image/jpeg;base64,${img}` }
                });
            });
            lastMsg.content = content;
        }
    }

    try {
        const response = await axios.post(
            GROQ_API_URL,
            {
                model,
                messages: [systemPrompt, ...formattedMessages],
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
