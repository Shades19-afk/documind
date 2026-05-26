# Phase 3 Implementation Roadmap

## Step 1 — Add AI primitives

- Create a Gemini client wrapper
- Add safe prompt builders
- Add response shaping helpers
- Add structured error types

## Step 2 — Add summary generation

- Generate document summaries
- Generate key points and overview
- Support long documents with chunked summarization
- Store safe fallback text when generation fails

## Step 3 — Add embeddings and vector retrieval

- Generate embeddings for chunk content
- Store embeddings in an abstraction-based vector store
- Implement cosine similarity search
- Return chunk metadata and citations

## Step 4 — Add chat API

- Build `/api/chat` with retrieval and grounding
- Add streamed responses for UI consumption
- Provide citation metadata and source snippets
- Handle retrieval and prompt errors safely

## Step 5 — Add chat UI

- Build `/chat` page
- Add markdown rendering
- Add streaming updates
- Add typing indicator and auto-scroll
- Persist recent chat history in local browser storage

## Step 6 — Wire the product

- Add navigation links from dashboard and documents
- Surface summaries in the library cards
- Add chat entry point from the document library

## Step 7 — Production hardening

- Add rate limiting prep hooks
- Add request caching for repeated summaries
- Add vector store swapping documentation
- Add observability and error logging hooks
