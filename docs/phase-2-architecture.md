# Phase 2 Architecture: Document Processing Pipeline

## Objective

Transform uploaded PDFs into structured, AI-ready content for summarization, retrieval, and chat while keeping the system modular, scalable, and deployable on Vercel.

## Target architecture

### 1. Client / UI
- Upload page and dashboard show upload, processing, and completion states.
- UI polls status endpoints and renders errors, skeletons, and progress.

### 2. API layer
- `/api/upload` validates uploads, stores metadata, and queues processing.
- `/api/process` triggers asynchronous processing for queued documents.
- `/api/documents/[id]/status` returns current processing state and error details.
- `/api/documents/[id]` returns processed metadata and retrieved chunks.

### 3. Processing service
- Validates file type and file size.
- Extracts text from PDF buffers.
- Splits extracted content into intelligent chunks.
- Generates chunk metadata for retrieval and downstream AI features.
- Tracks state transitions and stores processing results.

### 4. Storage layer
- **Current phase:** in-memory store for local development and UI scaffolding.
- **Production phase:** replace with Postgres + object storage + vector store.

### 5. Database schema

#### documents
- `id` (UUID)
- `user_id` (nullable in phase 1)
- `filename`
- `mime_type`
- `size_bytes`
- `storage_key`
- `status`
- `uploaded_at`
- `processed_at`
- `error_message`
- `page_count`
- `summary_id` (nullable)

#### extracted_chunks
- `id` (UUID)
- `document_id`
- `chunk_index`
- `content`
- `token_count`
- `start_page`
- `end_page`
- `summary`
- `embedding` (nullable in phase 1)
- `created_at`

#### processing_status
- `id` (UUID)
- `document_id`
- `state`
- `attempt_count`
- `last_error`
- `updated_at`

#### summaries
- `id` (UUID)
- `document_id`
- `content`
- `model`
- `created_at`

## Folder structure

src/
  app/
    api/
      upload/route.ts
      process/route.ts
      documents/[id]/route.ts
      documents/[id]/status/route.ts
  lib/
    processing/
      types.ts
      pdf.ts
      chunking.ts
      pipeline.ts
      store.ts
      validators.ts
      errors.ts
      index.ts
  components/
    ui/

## Processing flow

1. Upload request receives file.
2. Server validates MIME type and size.
3. Document record is created with `uploading` state.
4. Processing job is enqueued in memory.
5. Background worker extracts text and creates chunks.
6. Document state moves to `completed` or `failed`.
7. API routes expose current state and processed metadata.

## Failure handling

- Invalid mime type -> `failed`
- Oversized file -> `failed`
- Corrupted PDF -> `failed`
- PDF extraction failure -> `failed`
- Retry policy -> 3 attempts max with exponential backoff

## Vercel compatibility

- Use Node.js runtime for API routes.
- Keep processing logic server-side.
- Avoid long blocking work on the request thread.
- Use in-memory queues only as temporary scaffolding.
- Design storage interfaces so DB and object storage can be swapped later.

## Production migration path

1. Replace in-memory store with Postgres.
2. Move uploaded files to object storage.
3. Add embeddings and vector search.
4. Add summary generation via LLM.
5. Add job queue and background worker.

