# Phase 3 Architecture: AI + RAG Layer

## Objective

Add an AI and retrieval layer that can summarize uploaded PDFs, retrieve semantically relevant chunks, and support grounded chat with citations while keeping the stack compatible with Vercel.

## Target stack

- **App framework:** Next.js 16 App Router
- **Language:** TypeScript
- **LLM:** Google Gemini API via `@google/generative-ai`
- **Chunking / retrieval:** LangChain text splitters + in-memory vector index abstraction
- **Persistence model:** pluggable vector storage interface with an in-memory implementation for Phase 3, ready to swap for Pinecone, ChromaDB, or pgvector later
- **UI:** shadcn/ui + Tailwind CSS

## Architecture layers

### 1. Document intelligence services

- `src/lib/ai/summary-service.ts`
  - generate overview
  - generate key points
  - generate long-document summaries with section-aware prompts
  - fail safely with structured errors
- `src/lib/ai/rag-service.ts`
  - generate embeddings for chunks
  - store chunk metadata and embeddings in a vector store
  - perform semantic similarity search
  - return citations and source snippets

### 2. Vector store abstraction

- `src/lib/ai/vector-store.ts`
  - `upsertDocuments`
  - `query`
  - `deleteDocument`
  - `listDocuments`
- Phase 3 implementation uses an in-memory cosine-similarity store for all uploads in a single server instance.
- The interface is designed to be replaced with Pinecone or ChromaDB without changing call sites.

### 3. Chat orchestration

- `src/lib/ai/chat-service.ts`
  - builds retrieval-aware prompts
  - adds citations and grounding instructions
  - uses Gemini streaming for incremental responses
  - stores chat history in-memory or local browser storage
  - returns safe, bounded answers

### 4. API layer

- `/api/ai/summarize` — generate summary assets for a document
- `/api/ai/search` — retrieve semantically relevant chunks for a query
- `/api/chat` — chat with uploaded documents using retrieval and citations

### 5. UI layer

- `/chat` page
  - modern AI assistant interface
  - markdown-rendered responses
  - streaming text updates
  - typing indicator
  - auto-scroll
  - conversation history
  - citation/source cards

## Data flow

1. Document uploads are processed and chunks are created by Phase 2 pipeline.
2. Phase 3 generates embeddings for each chunk and stores them in the vector store.
3. When a user asks a question, the chat service embeds the query, retrieves top-k chunks, and injects them into a retrieval-augmented Gemini prompt.
4. Gemini returns grounded text, which is streamed to the client and annotated with citations.
5. The UI renders the response with markdown and expandable source snippets.

## Failure handling

- Summary generation failures return a safe fallback message and preserve the document state.
- Retrieval failures fall back to a safe empty-state answer instead of hallucinating.
- Prompt inputs are length-bounded and sanitized.
- Chat responses are always grounded in retrieved chunks. If retrieval returns no chunks, the model is instructed to say it cannot answer from the current document set.

## Vercel compatibility

- All AI work runs on the server.
- The vector store is a lightweight in-memory service managed in the Node.js runtime.
- The service boundary is modular so it can later be replaced by Pinecone, Chroma, or pgvector.
- API routes use streaming only where necessary and avoid heavy client bundling.

## Future migration path

1. Replace in-memory vector store with Pinecone or ChromaDB.
2. Add persistent chat history and document metadata in Postgres.
3. Add rate limiting and per-user quotas.
4. Add citation scoring and relevance explanations.
5. Add file-level summarization caches.
