import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Sparkles, CalendarDays, CheckSquare, Gavel } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ResponsibleAiNotice } from "@/components/ResponsibleAi";
import { ThinkingState, EmptyState } from "@/components/AiStates";
import { OutputToolbar } from "@/components/OutputToolbar";
import { summarizeNotes, type MeetingSummary } from "@/lib/ai.functions";
import { sampleMeetingNotes } from "@/lib/demo-data";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | Sammy's Coffee Shop" },
      {
        name: "description",
        content:
          "Turn raw café meeting notes into a summary, decisions, owner-assigned action items and key dates.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | Sammy's Coffee Shop" },
      {
        property: "og:description",
        content: "Structured meeting records with decisions, action items and deadlines.",
      },
    ],
  }),
  component: MeetingsPage,
});

function summaryToText(s: MeetingSummary) {
  return [
    `SUMMARY\n${s.summary}`,
    `KEY DECISIONS\n${s.decisions.map((d) => `- ${d}`).join("\n")}`,
    `ACTION ITEMS\n${s.actionItems.map((a) => `- ${a.task} — ${a.owner} (${a.deadline})`).join("\n")}`,
    `IMPORTANT DATES\n${s.dates.map((d) => `- ${d.date}: ${d.what}`).join("\n")}`,
  ].join("\n\n");
}

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<MeetingSummary | null>(null);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!notes.trim()) {
      toast.error("Paste some meeting notes first.");
      return;
    }
    setLoading(true);
    setEditing(false);
    try {
      const res = await summarizeNotes({ data: { notes } });
      setResult(res);
      setEditText(summaryToText(res));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sammy AI could not summarise these notes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        icon={FileText}
        title="Meeting Notes"
        subtitle="Turn messy notes into decisions, owners and deadlines the team can act on."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <Card className="surface-card h-fit border-none">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base">Raw notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              rows={16}
              placeholder="Paste your meeting notes here…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={run} disabled={loading}>
                <Sparkles className="size-4" />
                {loading ? "Summarizing…" : "Summarize with AI"}
              </Button>
              <Button variant="secondary" onClick={() => setNotes(sampleMeetingNotes)}>
                Load example notes
              </Button>
              <Button variant="ghost" onClick={() => setNotes("")}>
                Clear notes
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          {loading ? (
            <Card className="surface-card border-none">
              <CardContent className="pt-6">
                <ThinkingState label="Sammy AI is reading your notes…" />
              </CardContent>
            </Card>
          ) : !result ? (
            <Card className="surface-card border-none">
              <CardContent className="pt-6">
                <EmptyState
                  icon={FileText}
                  title="No summary yet"
                  description="Load the example notes from our Tuesday team meeting to see how the structured summary works."
                />
              </CardContent>
            </Card>
          ) : editing ? (
            <Card className="surface-card border-none">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-base">Edit summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  rows={20}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="font-mono text-sm"
                />
                <OutputToolbar
                  text={editText}
                  editing
                  onToggleEdit={() => setEditing(false)}
                  onRegenerate={run}
                  onClear={() => {
                    setResult(null);
                    setEditing(false);
                  }}
                />
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="surface-card gradient-cream border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-base">Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{result.summary}</p>
                </CardContent>
              </Card>

              <Card className="surface-card border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 font-display text-base">
                    <Gavel className="size-4 text-caramel" /> Key Decisions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {result.decisions.length === 0 && (
                    <p className="text-sm text-muted-foreground">No explicit decisions found.</p>
                  )}
                  {result.decisions.map((d, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border bg-background/60 px-4 py-2.5 text-sm"
                    >
                      {d}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="surface-card border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 font-display text-base">
                    <CheckSquare className="size-4 text-caramel" /> Action Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {result.actionItems.length === 0 && (
                    <p className="text-sm text-muted-foreground">No action items found.</p>
                  )}
                  {result.actionItems.map((a, i) => (
                    <div
                      key={i}
                      className="flex flex-wrap items-center gap-2.5 rounded-lg border border-border bg-background/60 px-4 py-3"
                    >
                      <span className="min-w-0 flex-1 text-sm font-medium">{a.task}</span>
                      <Badge variant="secondary">{a.owner}</Badge>
                      <Badge variant="outline" className="border-caramel/40 text-caramel">
                        {a.deadline}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="surface-card border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 font-display text-base">
                    <CalendarDays className="size-4 text-caramel" /> Important Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {result.dates.length === 0 && (
                    <p className="text-sm text-muted-foreground">No dates mentioned.</p>
                  )}
                  {result.dates.map((d, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <Badge className="border-none bg-accent text-accent-foreground">
                        {d.date}
                      </Badge>
                      <span className="text-muted-foreground">{d.what}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <OutputToolbar
                text={summaryToText(result)}
                onToggleEdit={() => {
                  setEditText(summaryToText(result));
                  setEditing(true);
                }}
                onRegenerate={run}
                onClear={() => setResult(null)}
              />
            </>
          )}
        </div>
      </div>

      <ResponsibleAiNotice />
    </div>
  );
}
