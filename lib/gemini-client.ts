import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize Gemini API client
const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    return new GoogleGenerativeAI(apiKey);
};

// Get Gemini 2.5 Flash model
export const getGeminiModel = () => {
    const genAI = getGeminiClient();

    return genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: {
            temperature: 0.8,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 300,
            candidateCount: 1,
        },
        safetySettings: [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ],
    });
};

// Build prompt for tweet generation
export const buildTweetPrompt = (
    niche: string,
    subcategory: string,
    guidance?: string
) => {
    return `You are an expert social media content creator specializing in ${niche}, particularly ${subcategory}.

⚠️ CRITICAL REQUIREMENT ⚠️
You MUST generate a tweet that is AT LEAST 20 words and AT MOST 50 words.
DO NOT generate tweets shorter than 20 words. This is MANDATORY.

Word count examples:
- 3 words = TOO SHORT ❌
- 8 words = TOO SHORT ❌
- 15 words = TOO SHORT ❌
- 20-50 words = PERFECT ✅

Your tweet MUST:
1. Be AT LEAST 20 words (count them carefully!)
2. Be AT MOST 50 words
3. Be under 280 characters total
4. Include a complete thought or message (not a fragment)
5. Have a clear hook or interesting angle
6. Sound natural and conversational
7. Provide value, insight, or entertainment
8. Include 1-2 relevant hashtags (optional, at the end)
9. Use 0-2 emojis maximum (optional)

AVOID:
- Short phrases or fragments (minimum 20 words!)
- Clickbait or spam language
- Overly promotional content
- Generic statements

${guidance ? `Additional user guidance: ${guidance}` : ''}

EXAMPLES OF CORRECT LENGTH (count the words):
Example 1 (34 words): "Career development isn't just about climbing the ladder. It's about building skills that make you irreplaceable. Focus on learning, networking, and delivering value. Your next opportunity is closer than you think. 💼 #CareerGrowth"

Example 2 (42 words): "The best career advice I ever received: Don't wait for permission to lead. Take initiative on projects, mentor others, and showcase your expertise. Leadership isn't a title, it's a mindset. Start acting like the professional you want to become. #Leadership"

Now generate a ${niche} tweet about ${subcategory}. 
REMEMBER: Minimum 20 words! Count them before responding!

Generate ONLY the tweet text. No quotation marks, no explanations, no meta-commentary.`;
};

// Generate tweet using Gemini with retry logic
export const generateTweetWithGemini = async (
    niche: string,
    subcategory: string,
    guidance?: string,
    maxRetries: number = 3
): Promise<{ text: string; prompt: string }> => {
    let lastError: Error | null = null;

    // Try up to maxRetries times
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const model = getGeminiModel();
            const prompt = buildTweetPrompt(niche, subcategory, guidance);

            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text().trim();

            // Remove any quotation marks that might be added
            let cleanText = text.replace(/^["']|["']$/g, '');

            // Remove any meta-commentary or explanations
            cleanText = cleanText.split('\n')[0].trim();

            // Validate word count
            const wordCount = cleanText.split(/\s+/).length;

            // If too short, retry
            if (wordCount < 15) {
                lastError = new Error(`Generated tweet is too short (${wordCount} words). Minimum is 20 words. Attempt ${attempt}/${maxRetries}`);
                console.warn(`Attempt ${attempt}: Tweet too short (${wordCount} words). Retrying...`);

                // Wait a bit before retrying
                if (attempt < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    continue;
                }
                throw lastError;
            }

            // Ensure it's within Twitter's character limit
            if (cleanText.length > 280) {
                // Try to trim at word boundary
                const words = cleanText.split(' ');
                let trimmed = '';
                for (const word of words) {
                    if ((trimmed + ' ' + word).length <= 277) {
                        trimmed += (trimmed ? ' ' : '') + word;
                    } else {
                        break;
                    }
                }
                cleanText = trimmed + '...';
            }

            return {
                text: cleanText,
                prompt,
            };
        } catch (error) {
            lastError = error as Error;

            // If it's not a word count error, throw immediately
            if (!lastError.message.includes('too short')) {
                console.error('Gemini API Error:', error);
                throw error;
            }

            // If this was the last attempt, throw the error
            if (attempt === maxRetries) {
                console.error(`Failed after ${maxRetries} attempts:`, lastError);
                throw lastError;
            }
        }
    }

    // Should never reach here, but TypeScript needs it
    throw lastError || new Error('Failed to generate tweet');
};
