import "server-only";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _pipe: any = null;
let _failed = false;

async function getPipeline() {
  if (_failed) return null;
  if (_pipe) return _pipe;

  try {
    // Dynamic import so the module only loads on first use, never at startup
    const { pipeline, env } = await import("@huggingface/transformers");
    env.cacheDir = "C:/hf_cache";
    env.allowLocalModels = false;
    env.useBrowserCache = false;

    _pipe = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
      dtype: "fp32",
    });
    return _pipe;
  } catch (err) {
    console.warn("[RAG] Transformer embeddings unavailable, will use keyword fallback:", err);
    _failed = true;
    return null;
  }
}

export async function embed(text: string): Promise<number[] | null> {
  const extractor = await getPipeline();
  if (!extractor) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (extractor as any)(text, { pooling: "mean", normalize: true });
    return Array.from((result as { data: Float32Array }).data);
  } catch {
    return null;
  }
}

export function isEmbeddingsAvailable(): boolean {
  return !_failed;
}
