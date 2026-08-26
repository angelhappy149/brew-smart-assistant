import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { chatComplete, parseJson, BRAND_CONTEXT } from "./ai.server";

/* ---------------------------------- types --------------------------------- */

export type MeetingSummary = {
  summary: string;
  decisions: string[];
  actionItems: { task: string; owner: string; deadline: string }[];
  dates: { date: string; what: string }[];
};

export type DayPlan = {
  today: { time: string; task: string; priority: string; duration: string; why: string }[];
  upcoming: { task: string; deadline: string; priority: string }[];
  note: string;
};

/* ------------------------------ email generator ---------------------------- */

const EmailInput = z.object({
  recipient: z.string().min(1),
  subject: z.string().default(""),
  purpose: z.string().min(1),
  tone: z.string().default("Professional"),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }) => {
    const system = `ROLE: You are a professional workplace communications assistant.
CONTEXT: ${BRAND_CONTEXT}
TASK: Write one workplace email on behalf of the sender.
OUTPUT FORMAT: Plain text email only. First line "Subject: ...", then a blank line, then greeting, 1-3 short paragraphs, a clear call to action, then a sign-off from "Sammy" of Sammy's Coffee Shop.
CONSTRAINTS: Under 180 words. No markdown, no placeholders like [name] unless the user gave none. Never invent prices, figures or commitments that were not supplied. Match the requested tone exactly.`;
    const user = `Recipient: ${data.recipient}
Subject hint: ${data.subject || "(none — write a suitable subject)"}
Tone: ${data.tone}
Purpose / message to convey: ${data.purpose}`;
    return { text: await chatComplete({ system, user }) };
  });

/* --------------------------- meeting notes summariser ---------------------- */

const NotesInput = z.object({ notes: z.string().min(1) });

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => NotesInput.parse(d))
  .handler(async ({ data }) => {
    const system = `ROLE: You are an executive meeting analyst.
CONTEXT: ${BRAND_CONTEXT}
TASK: Turn raw meeting notes into a structured record. Identify a concise summary, the decisions that were actually made, action items with the responsible person and deadline, and any important dates mentioned.
OUTPUT FORMAT: JSON only, matching:
{"summary": string, "decisions": string[], "actionItems": [{"task": string, "owner": string, "deadline": string}], "dates": [{"date": string, "what": string}]}
CONSTRAINTS: Only use information present in the notes. If an owner or deadline is missing use "Unassigned" / "No deadline". Keep each entry to one short sentence. Tone: neutral and professional.`;
    const raw = await chatComplete({ system, user: `Meeting notes:\n${data.notes}`, json: true });
    return parseJson<MeetingSummary>(raw, {
      summary: raw,
      decisions: [],
      actionItems: [],
      dates: [],
    });
  });

/* ------------------------------- task planner ------------------------------ */

const PlanInput = z.object({
  tasks: z.array(
    z.object({
      task: z.string(),
      deadline: z.string(),
      priority: z.string(),
      estimate: z.string(),
    }),
  ),
  horizon: z.string().default("day"),
});

export const createPlan = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PlanInput.parse(d))
  .handler(async ({ data }) => {
    const system = `ROLE: You are an operations planner for a busy coffee shop manager.
CONTEXT: ${BRAND_CONTEXT} The working day runs 07:00-17:00 with a peak service rush from 07:30-10:00 and 12:00-13:30 — avoid scheduling deep work in those windows.
TASK: Sequence the supplied tasks into a realistic schedule, prioritising by urgency, importance, deadline and estimated time. Anything not fitting today goes to "upcoming".
OUTPUT FORMAT: JSON only:
{"today": [{"time": "HH:MM", "task": string, "priority": "High"|"Medium"|"Low", "duration": string, "why": string}], "upcoming": [{"task": string, "deadline": string, "priority": string}], "note": string}
CONSTRAINTS: Do not invent tasks. "why" is one short sentence of reasoning. "note" is one sentence of practical advice.`;
    const user = `Planning horizon: ${data.horizon}\nTasks:\n${data.tasks
      .map(
        (t, i) =>
          `${i + 1}. ${t.task} | deadline: ${t.deadline || "none"} | importance: ${t.priority} | estimated time: ${t.estimate || "unknown"}`,
      )
      .join("\n")}`;
    const raw = await chatComplete({ system, user, json: true });
    return parseJson<DayPlan>(raw, { today: [], upcoming: [], note: raw });
  });

/* ----------------------------- research assistant -------------------------- */

const ResearchInput = z.object({
  topic: z.string().min(1),
  context: z.string().default(""),
  depth: z.string().default("Standard"),
});

export const runResearch = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ResearchInput.parse(d))
  .handler(async ({ data }) => {
    const lengths: Record<string, string> = {
      "Quick Overview": "roughly 150 words in total",
      Standard: "roughly 300 words in total",
      Detailed: "roughly 550 words in total",
    };
    const system = `ROLE: You are a business research assistant for small hospitality businesses.
CONTEXT: ${BRAND_CONTEXT}
TASK: Research the requested topic and separate established facts from interpretation and advice.
OUTPUT FORMAT: Markdown with exactly these headings: "## Overview", "## Key Insights", "## Recommendations", "## Practical Application", "## Verify Before Acting". Use bullet points under the last four.
CONSTRAINTS: ${lengths[data.depth] ?? lengths.Standard}. Be concrete and operational for a coffee shop. Never fabricate statistics — if a number is uncertain, say so and list it under "Verify Before Acting".`;
    const user = `Topic: ${data.topic}\nDepth: ${data.depth}\nExtra context: ${data.context || "none"}`;
    return { markdown: await chatComplete({ system, user }) };
  });

/* --------------------------------- chatbot --------------------------------- */

const ChatInput = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })),
});

export const askSammyAi = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ChatInput.parse(d))
  .handler(async ({ data }) => {
    const system = `ROLE: You are "Sammy AI", the in-house workplace productivity assistant.
CONTEXT: ${BRAND_CONTEXT}
TASK: Help the manager and staff with day-to-day work: drafting communication, planning tasks, summarising, and operational problem solving.
OUTPUT FORMAT: Short markdown. Use headings and bullet points when the answer has structure; otherwise 1-2 tight paragraphs.
CONSTRAINTS: Practical and specific to a coffee shop. Ask a clarifying question when the request is ambiguous. Never invent business figures — flag assumptions instead. Warm, friendly, professional tone.`;
    const history = data.messages.slice(0, -1);
    const last = data.messages[data.messages.length - 1];
    return {
      text: await chatComplete({ system, user: last?.content ?? "", history }),
    };
  });
