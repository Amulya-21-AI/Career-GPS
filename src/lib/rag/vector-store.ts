import "server-only";

export interface VectorEntry<T = Record<string, unknown>> {
  id: string;
  embedding: number[];
  metadata: T;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

export class InMemoryVectorStore<T = Record<string, unknown>> {
  private entries: VectorEntry<T>[] = [];

  add(entry: VectorEntry<T>) {
    this.entries.push(entry);
  }

  addAll(entries: VectorEntry<T>[]) {
    this.entries.push(...entries);
  }

  search(queryEmbedding: number[], topK = 3): Array<{ entry: VectorEntry<T>; score: number }> {
    return this.entries
      .map((entry) => ({ entry, score: cosineSimilarity(queryEmbedding, entry.embedding) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  get size() {
    return this.entries.length;
  }

  clear() {
    this.entries = [];
  }
}
