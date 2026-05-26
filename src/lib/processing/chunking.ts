import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ExtractedChunk } from "./types";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1200,
  chunkOverlap: 180,
  separators: ["\n\n", "\n", " ", ""],
});

function buildSummary(content: string): string {
  const normalized = content.replace(/\s+/g, " ").trim();
  return normalized.slice(0, 140);
}

export async function createChunksForDocument(
  documentId: string,
  text: string,
  pageCount: number
): Promise<ExtractedChunk[]> {
  const chunks = await splitter.splitText(text);

  return chunks.map((chunk, index) => ({
    id: `${documentId}-chunk-${index}`,
    documentId,
    content: chunk,
    metadata: {
      chunkIndex: index,
      tokenCount: Math.ceil(chunk.split(/\s+/).length),
      startPage: 1,
      endPage: pageCount > 0 ? pageCount : 1,
      summary: buildSummary(chunk),
    },
  }));
}
