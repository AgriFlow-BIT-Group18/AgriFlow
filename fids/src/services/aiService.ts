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

export const getChatCompletion = async (messages: Message[], persona: AIPersona = 'neural', images?: string[], detectedLanguage?: string, isVoiceSource = false) => {
    const apiKey = getApiKey();
    
    if (!apiKey) {
        throw new Error('Groq API Key not found. Please set NEXT_PUBLIC_GROQ_API_KEY or providing it via settings.');
    }

    const basePrompt = PERSONA_PROMPTS[persona];
    // We rely on the LLM's natural language detection (more robust than regex)
    // combined with the explicit system prompt below.
        
    const voiceInstruction = isVoiceSource
        ? `\n\n        ### VOICE INPUT MODE:\n        The user is speaking to you via microphone (Speech-to-Text). Your response will be displayed as TEXT only. Be direct and helpful. You are allowed to use markdown and lists if helpful, as the user will be READING your response.`
        : '';

    const systemPrompt: Message = {
        role: 'system',
        content: `### IDENTITY:\n        ${basePrompt}\n        \n        ### CORE INSTRUCTION:\n        - Always respond in the SAME language as the user's latest message.\n        - STRICT: Do not start an English response with "Bonjour" or any French greeting.\n        - STRICT: If the user speaks English, respond 100% in English. If the user speaks French, respond 100% in French.\n        - Use "FCFA" for currency.\n        - Context: AgriFlow digital agricultural distribution system.`
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
