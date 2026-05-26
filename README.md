# DocuMind

DocuMind is a modern AI document intelligence platform built with Next.js. It helps teams upload, organize, search, and understand documents faster with a clean SaaS-style experience.

## Overview

DocuMind currently includes:

- A polished landing page with modern AI SaaS branding
- A document dashboard for workspace summaries and upload status
- A document library for browsing uploaded PDFs
- Local storage-backed document metadata for the current UI flow

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Project structure

- `src/app/page.tsx` — marketing landing page
- `src/app/dashboard/page.tsx` — product dashboard
- `src/app/documents/page.tsx` — document library
- `src/lib/documents-storage.ts` — local document metadata helpers
- `src/components/ui` — reusable UI primitives

## Available scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run lint` — run ESLint
- `npm start` — start the production server

## Deployment

DocuMind is ready to deploy on any platform that supports Next.js, including Vercel, Netlify, and managed Node.js hosting.

## Roadmap

- Real upload and backend processing pipeline
- AI-powered document summaries and Q&A
- Auth and team collaboration
- Persistent storage and search indexing
- Production monitoring and deployment automation

## Branding

DocuMind uses a modern, premium AI SaaS visual language with concise product messaging centered on clarity, trust, and speed.

