import { NextResponse } from 'next/server';
import { generateTweetWithGemini } from '@/lib/gemini-client';
import { addHashtagsToTweet } from '@/lib/hashtags';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { niche, subcategory, guidance } = body;

        // Validate inputs
        if (!niche || !subcategory) {
            return NextResponse.json(
                { error: 'Niche and subcategory are required' },
                { status: 400 }
            );
        }

        // Generate tweet using Gemini (with retry logic)
        const { text, prompt } = await generateTweetWithGemini(
            niche,
            subcategory,
            guidance
        );

        // Add smart hashtags if not already present
        const tweetWithHashtags = addHashtagsToTweet(text, niche, subcategory);

        return NextResponse.json({
            success: true,
            tweet: tweetWithHashtags,
            prompt,
            metadata: {
                niche,
                subcategory,
                guidance,
                model: 'gemini-2.5-flash',
                generatedAt: Date.now(),
                hashtagsAdded: text !== tweetWithHashtags,
            },
        });
    } catch (error: unknown) {
        console.error('Tweet generation error:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        // Check for specific Gemini API errors
        if (errorMessage.includes('API key')) {
            return NextResponse.json(
                { error: 'Gemini API key is not configured. Please add GEMINI_API_KEY to your environment variables.' },
                { status: 500 }
            );
        }

        if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
            return NextResponse.json(
                { error: 'Rate limit exceeded. Please try again later.' },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
