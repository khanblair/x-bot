# Troubleshooting Guide

## SWC Binary Issue (Windows)

If you encounter the "Failed to load SWC binary for win32/x64" error, try these solutions:

### Solution 1: Clean Reinstall
```bash
Remove-Item -Path "node_modules" -Recurse -Force
Remove-Item -Path "package-lock.json" -Force
npm cache clean --force
npm install
```

### Solution 2: Install Visual C++ Redistributables
Download and install the latest Visual C++ Redistributables from Microsoft:
https://aka.ms/vs/17/release/vc_redist.x64.exe

### Solution 3: Use SWC WASM Fallback
The project already has `@next/swc-wasm-nodejs` installed as a fallback.

### Solution 4: Update Node.js
Ensure you're using Node.js 18+ (LTS recommended)
```bash
node --version
```

### Solution 5: Try Experimental Build
Add to package.json scripts:
```json
"dev:exp": "next dev --experimental-https"
```

## Quick Start (If Server Works)

Once the dev server starts successfully:

1. Open http://localhost:3000
2. Click "Explore Feed" or "Search Tweets"
3. Try different usernames (twitter, elonmusk, etc.)
4. Test theme switching with the moon/sun icon
5. Try installing as PWA (look for install prompt)

## Project Features Implemented

✅ Landing page with glassmorphism design
✅ Feed page for user timelines
✅ Search page with advanced queries
✅ Dark/Light theme switching
✅ Responsive design (mobile, tablet, desktop)
✅ PWA manifest and service worker
✅ Tweet caching for offline use
✅ Share functionality
✅ Twitter API v2 integration
✅ React Query for data fetching

## Manual Testing

If dev server won't start, you can still inspect the code:
- All components are in `/components`
- Pages are in `/app`
- API routes in `/app/api`
- PWA config in `/public/manifest.json` and `/public/sw.js`
