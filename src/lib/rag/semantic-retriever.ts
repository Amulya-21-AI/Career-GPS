import "server-only";
import { careers } from "@/data/careers";
import type { Career, UserProfile } from "@/types";
import { embed } from "./embeddings";
import { InMemoryVectorStore } from "./vector-store";

// Module-level store — built once, reused across requests
let store: InMemoryVectorStore<{ career: Career }> | null = null;
let buildingPromise: Promise<void> | null = null;

function careerToText(c: Career): string {
  return [
    c.title,
    c.category,
    c.description,
    ...c.requiredSkills,
    ...c.niceToHaveSkills,
    ...c.tools,
    ...c.interestsMatched,
    ...c.preferredBackgrounds,
    ...c.entryPathways,
  ].join(" ");
}

async function buildStore(): Promise<void> {
  if (store && store.size > 0) return;

  console.log("[RAG] Building semantic career vector store…");
  const newStore = new InMemoryVectorStore<{ career: Career }>();

  for (const career of careers) {
    const text = careerToText(career);
    const embedding = await embed(text);
    if (!embedding) {
      // Embeddings unavailable — abort silently, fall back to keyword retrieval
      console.warn("[RAG] Embeddings returned null, skipping vector store build");
      store = newStore; // empty store signals fallback
      return;
    }
    newStore.add({ id: career.id, embedding, metadata: { career } });
  }

  store = newStore;
  console.log(`[RAG] Vector store ready — ${store.size} careers indexed`);
}

async function getStore(): Promise<InMemoryVectorStore<{ career: Career }>> {
  if (!store || store.size === 0) {
    if (!buildingPromise) {
      buildingPromise = buildStore().finally(() => { buildingPromise = null; });
    }
    await buildingPromise;
  }
  return store!;
}

function formatContext(results: Career[]): string {
  if (results.length === 0) return "";
  const blocks = results.map((c) => `
CAREER: ${c.title} (${c.category})
Description: ${c.description}
Required Skills: ${c.requiredSkills.slice(0, 5).join(", ")}
Salary Entry: ${c.salaryRangeEntry} | Mid: ${c.salaryRangeMid} | Senior: ${c.salaryRangeSenior}
Timeline to job-ready: ~${c.timelineMonths} months
Remote: ${c.remoteFriendlyScore}/10 | Demand: ${c.demandScore}/10 | Difficulty: ${c.difficultyScore}/10
Entry pathways: ${c.entryPathways.slice(0, 2).join("; ")}
Beginner projects: ${c.beginnerProjects.slice(0, 2).join("; ")}
`.trim());
  return `RELEVANT CAREER DATA (semantic search):\n${blocks.join("\n\n")}`;
}

export interface SemanticRetrievedContext {
  careers: Career[];
  formatted: string;
}

export async function semanticRetrieve(
  query: string,
  profile?: Partial<UserProfile>,
  topK = 3
): Promise<SemanticRetrievedContext> {
  try {
    const s = await getStore();

    // If store is empty, embeddings are unavailable — signal caller to use keyword fallback
    if (s.size === 0) {
      return { careers: [], formatted: "" };
    }

    const enriched = profile?.interests
      ? `${query} ${profile.interests.join(" ")}`
      : query;
    const queryEmbedding = await embed(enriched);

    if (!queryEmbedding) {
      return { careers: [], formatted: "" };
    }

    const results = s.search(queryEmbedding, topK);
    const matched = results.map((r) => r.entry.metadata.career);
    return { careers: matched, formatted: formatContext(matched) };
  } catch (err) {
    console.error("[RAG] Semantic retrieval failed, returning empty:", err);
    return { careers: [], formatted: "" };
  }
}
