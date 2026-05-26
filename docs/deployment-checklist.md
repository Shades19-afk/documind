# DocuMind deployment checklist

## Required environment

- `GEMINI_API_KEY`
- `NEXT_PUBLIC_BASE_URL`

## Recommended hosting

- Vercel for the simplest Next.js deployment
- Calibrate build settings to use Node.js 18 or newer

## Pre-deployment

- Verify `.env.local` mirrors `.env.example`
- Run `npm run lint`
- Run `npm run build`
- Review all API routes for production behavior

## Production hardening

- Replace in-memory document storage with database-backed persistence
- Add authentication and per-user workspace isolation
- Add rate limiting and request monitoring
- Add background job processing for large uploads
- Add secure file handling and document retention policies
