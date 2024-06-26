import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import systemMessage from '../../util/prompt';

export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    const { messages } = await req.json();

    const result = await streamText({
        model: openai('gpt-3.5-turbo'),
        system: systemMessage,
        messages,
    });

    const stream = result.toAIStream({
        onFinal: () => {
            // Perform any cleanup or additional actions here if needed
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
};
