import { NextResponse } from 'next/server';


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { niche, subcategory, guidance, model } = body;

        // Model is technically optional now or defaults to apifreellm if provided, 
        // but we'll ignore it or enforce apifreellm logic.

        if (!niche || !subcategory) {
            return NextResponse.json(
                { error: 'Niche and subcategory are required' },
                { status: 400 }
            );
        }

        let prompt = `Write a short, engaging tweet about ${subcategory} in the ${niche} niche.`;
        if (guidance) {
            prompt += ` Guidance: ${guidance}.`;
        }
        prompt += ` Include 2 relevant hashtags. Do not include quotes.`;

        let tweetText = '';
        let promptUsed = '';

        // APIFreeLLM (Default/Only option)
        const API_URL = process.env.APIFREELLM_FREE_URL || "https://apifreellm.com/api/v1/chat";
        const API_KEY = process.env.APIFREELLM_FREE_API;

        if (!API_URL) {
            console.error("APIFREELLM_FREE_URL environment variable not set");
            throw new Error("API configuration missing. Please contact support.");
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

            const apiResponse = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${API_KEY}`,
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                },
                body: JSON.stringify({
                    message: prompt
                }),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            if (!apiResponse.ok) {
                console.error(`APIFreeLLM API error: ${apiResponse.status} ${apiResponse.statusText}`);
                const errorText = await apiResponse.text();
                console.error("APIFreeLLM error body:", errorText.substring(0, 500));
                throw new Error(`APIFreeLLM request failed with status ${apiResponse.status}: ${errorText.substring(0, 200)}`);
            }

            const data = await apiResponse.json();

            if (!data.response) {
                console.error("APIFreeLLM returned no response content:", data);
                throw new Error("APIFreeLLM returned empty response");
            }

            tweetText = data.response;
            promptUsed = prompt;

        } catch (error) {
            console.error("APIFreeLLM generation error:", error);
            if (error instanceof Error) {
                throw new Error(`Failed to generate tweet with APIFreeLLM: ${error.message}`);
            }
            throw new Error("Failed to generate tweet with APIFreeLLM. Please try again later.");
        }

        return NextResponse.json({
            tweet: tweetText,
            prompt: promptUsed,
            metadata: {
                model: 'apifreellm-free',
                niche,
                subcategory,
                guidance
            }
        });

    } catch (error: unknown) {
        console.error('Error generating tweet:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
