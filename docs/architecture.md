# DocuMind architecture

## Product goal

DocuMind is a summarizer-first AI document intelligence SaaS for converting uploads into study-ready outputs, including summaries, key points, study notes, and flashcards.

## Current architecture

### Frontend

- Next.js App Router application in `src/app`
- Tailwind CSS and shadcn/ui primitives
- Document workflow pages for dashboard and document library
- Local browser cache for document metadata and generated study packages

### Backend / API

- Route handlers under `src/app/api`
- PDF ingestion and processing helpers in `src/lib`
- Gemini-backed generation via `src/lib/ai/summary-service.ts`

### Data flow

1. User uploads a PDF.
2. The client parses the file and triggers document processing.
3. The backend stores processed metadata in memory.
4. The AI layer generates a study package with summary, overview, key points, study notes, and flashcards.
5. The UI renders the study package and supports exports.

## Recommended next steps

- Replace in-memory storage with a durable database.
- Add authentication and workspace isolation.
- Add background job processing for large uploads.
- Add export and sharing workflows for study packages.
- Add monitoring, rate limiting, and usage tracking.
