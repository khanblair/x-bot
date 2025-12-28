# Deployment Guide - X-Bot on Vercel

## Environment Variables Required

To deploy X-Bot on Vercel, you need to set the following environment variables in your Vercel dashboard:

### Twitter API Credentials
```
CONSUMER_API_KEY=your_consumer_api_key
CONSUME_SECRET_KEY=your_consumer_secret
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
ACCESS_TOKEN=your_access_token
ACCESS_TOKEN_SECRET=your_access_token_secret
```

### Convex Backend
```
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
```

### AI/LLM Generation
```
APIFREELLM_FREE_URL=https://apifreellm.com/api/chat
GEMINI_API_KEY=your_gemini_api_key (if using Gemini)
```

### Push Notifications
```
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

### Application URLs
```
NEXT_PUBLIC_APP_URL_PROD=your_vercel_deployment_url
```

## Setup Instructions

### 1. Create Vercel Project
```bash
vercel link
```

### 2. Set Environment Variables
In your Vercel dashboard (Settings → Environment Variables), add all the variables listed above.

### 3. Configure Twitter API
- Go to [Twitter Developer Portal](https://developer.twitter.com)
- Create an app with read and write permissions
- Generate OAuth 1.0a credentials
- Add the credentials to Vercel environment

### 4. Deploy
```bash
git push origin main
# OR manually deploy through Vercel dashboard
```

## Troubleshooting

### "Failed to generate tweet with APIFreeLLM" Error
This error occurs when:

1. **Missing Environment Variable**: `APIFREELLM_FREE_URL` is not set in Vercel
   - **Fix**: Add `APIFREELLM_FREE_URL=https://apifreellm.com/api/chat` to environment variables

2. **API Service Unavailable**: The APIFreeLLM API is down or unreachable
   - **Fix**: Check https://apifreellm.com status or use an alternative LLM provider

3. **Network Issues**: Fetch request times out or fails
   - **Fix**: Check Vercel function logs in the dashboard

### Automatic Tweet Generation Not Working (Every 2 Hours)
The cron job runs in `convex/crons.ts` but requires:

1. **Convex Backend Connected**: Ensure `NEXT_PUBLIC_CONVEX_URL` is set correctly
2. **Twitter Credentials Valid**: Check that Twitter API keys are correct and have write permissions
3. **Convex Functions Deployed**: Run `bunx convex deploy` to push cron jobs

**To verify**:
- Check Convex dashboard for function execution logs
- Check Vercel Function logs for errors

## Local Development

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your actual values

# Start development server
bun dev

# In another terminal, start Convex
bunx convex dev
```

## Cron Job Details

- **Location**: `convex/crons.ts`
- **Tweet Generation**: Every 2 hours
- **Daily Limit**: Max 15 AI-generated tweets per day
- **Niche Balancing**: Rotates through predefined topics for variety

## Need Help?

- Check Vercel Function Logs in dashboard
- Check Convex Console for mutation/query errors
- Verify all environment variables are correctly set
- Ensure Twitter API credentials have correct permissions
