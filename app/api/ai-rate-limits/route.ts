import { NextResponse } from 'next/server';
import { api } from '@/convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const endpoint = searchParams.get('endpoint') || 'apifreellm-generate';

        const limits = await convex.query(api.rateLimits.getRateLimits, {
            endpoint: endpoint,
        });

        return NextResponse.json({
            success: true,
            limits,
        });
    } catch (error: unknown) {
        console.error('Error fetching rate limits:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const endpoint = body.endpoint || 'apifreellm-generate';

        const result = await convex.mutation(api.rateLimits.updateRateLimit, {
            endpoint: endpoint,
        });

        return NextResponse.json(result);
    } catch (error: unknown) {
        console.error('Error updating rate limit:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
