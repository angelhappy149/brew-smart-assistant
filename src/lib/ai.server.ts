const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.7-flash";

export class AiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * Single low-level entry point for every Lovable AI call in the app.
 * Prompts are always structured: a role/context system prompt + a task prompt.
 */
export async function chatComplete(opts: {
  system: string;
  user: string;
  json?: boolean;
  history?: { role: "user" | "assistant"; content: string }[];
}): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new AiError(500, "AI is not configured for this workspace.");

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: opts.system },
        ...(opts.history ?? []),
        { role: "user", content: opts.user },
      ],
      ...(opts.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    if (res.status === 429)
      throw new AiError(429, "Sammy AI is busy right now — please try again in a moment.");
    if (res.status === 402)
      throw new AiError(402, "AI credits are exhausted. Add credits in Lovable to continue.");
    if (res.status === 403)
      throw new AiError(403, "AI access is currently blocked for this workspace.");
    throw new AiError(res.status, `AI request failed (${res.status}). ${body.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

export function parseJson<T>(raw: string, fallback: T): T {
  const cleaned = raw
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1)) as T;
      } catch {
        /* ignore */
      }
    }
    return fallback;
  }
}

export const BRAND_CONTEXT = `You work for Sammy's Coffee Shop, an independent premium coffee shop in South Africa (currency: South African Rand, "R"). The team is small: Sammy (owner/manager), 6 baristas, 2 bakers, and a part-time cleaner. Typical operational topics are inventory, coffee bean suppliers, staff shifts, customer feedback, equipment maintenance, bakery waste and daily sales.`;
