import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

export const dynamic = 'force-dynamic';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
    try {
        const limits = await convex.query(api.geminiLimits.getRateLimits, {});

        return NextResponse.json({
            success: true,
            limits,
        });
    } catch (error: unknown) {
        console.error('Error fetching Gemini rate limits:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}

export async function POST() {
    try {
        const result = await convex.mutation(api.geminiLimits.updateRateLimit, {
            endpoint: 'generate-tweet',
        });

        if (!result.success) {
            return NextResponse.json(
                {
                    error: result.error,
                    resetTime: result.resetTime,
                },
                { status: 429 }
            );
        }

        return NextResponse.json({
            success: true,
            remaining: result.remaining,
        });
    } catch (error: unknown) {
        console.error('Error updating Gemini rate limits:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
