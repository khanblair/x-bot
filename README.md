# X-Bot - Twitter Feed Viewer

A modern, PWA-enabled Twitter/X feed viewer built with Next.js 15, TypeScript, and the Twitter API v2.

## Features

✨ **Modern UI with Glassmorphism** - Beautiful liquid glass design with Twitter theme  
🌓 **Dark/Light Mode** - Seamless theme switching with persistent preferences  
📱 **PWA Support** - Install on any device for app-like experience  
⚡ **Lightning Fast** - Optimized with React Query caching and Next.js 15  
🔄 **Offline Ready** - Service worker caches tweets for offline browsing  
🔍 **Advanced Search** - Search tweets with powerful query operators  
📤 **Share Functionality** - Native share API with clipboard fallback  
🎨 **Fully Responsive** - Works perfectly on all screen sizes  

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **API:** Twitter API v2 (twitter-api-v2)
- **State Management:** @tanstack/react-query
- **Icons:** Lucide React
- **PWA:** Custom Service Worker

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

## Project Structure

```
x-bot/
├── app/
│   ├── api/              # API routes for Twitter integration
│   │   ├── tweets/       # Fetch user timeline
│   │   ├── search/       # Search tweets
│   │   └── me/           # Get authenticated user info
│   ├── feed/             # User timeline page
│   ├── search/           # Search page
│   ├── layout.tsx        # Root layout with providers
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles with Twitter theme
├── components/           # Reusable UI components
│   ├── TweetCard.tsx     # Tweet display component
│   ├── ThemeToggle.tsx   # Theme switcher
│   ├── GlassCard.tsx     # Glassmorphism card wrapper
│   ├── ShareButton.tsx   # Share functionality
│   └── LoadingSpinner.tsx
├── lib/                  # Utility functions and configs
│   ├── theme-context.tsx # Theme provider
│   ├── query-provider.tsx # React Query setup
│   ├── twitter-client.ts # Twitter API client
│   └── types.ts          # TypeScript types
├── public/
│   ├── manifest.json     # PWA manifest
│   └── sw.js            # Service worker
└── .env.local           # API credentials
```

## Pages

### Landing Page (/)
- Animated hero section with gradient text
- Feature cards with glassmorphism effect
- Responsive navigation

### Feed Page (/feed)
- Load any user's timeline by username
- Real-time refresh functionality
- Engagement metrics display

### Search Page (/search)
- Advanced search with operators (OR, AND, NOT)
- Real-time search results
- Cached for offline access

## API Routes

**GET /api/tweets** - Fetch user timeline  
Query params: `username`, `max` (default: 10)

**GET /api/search** - Search tweets  
Query params: `q` (query), `max` (default: 10)

**GET /api/me** - Get authenticated user info

## Build & Deploy

```bash
npm run build
npm start
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
