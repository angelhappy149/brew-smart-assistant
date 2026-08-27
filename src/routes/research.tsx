import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Sparkles, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResponsibleAiNotice } from "@/components/ResponsibleAi";
import { ThinkingState, EmptyState } from "@/components/AiStates";
import { OutputToolbar } from "@/components/OutputToolbar";
import { AiMarkdown } from "@/components/AiMarkdown";
import { runResearch } from "@/lib/ai.functions";
import { recentResearch } from "@/lib/demo-data";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | Sammy's Coffee Shop" },
      {
        name: "description",
        content:
          "Research café operations topics — waste, service, marketing and sustainability — with practical recommendations.",
      },
      { property: "og:title", content: "AI Research Assistant | Sammy's Coffee Shop" },
      {
        property: "og:description",
        content: "Practical, operations-focused research for coffee shop teams.",
      },
    ],
  }),
  component: ResearchPage,
});

const topics = [
  "Ways to reduce coffee-shop food waste",
  "Improving customer service at peak hours",
  "Reducing inventory waste",
  "Social media marketing ideas",
  "Coffee-shop productivity",
  "Staff communication",
  "Sustainable coffee-shop practices",
];

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [depth, setDepth] = useState("Standard");
  const [markdown, setMarkdown] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!topic.trim()) {
      toast.error("Enter a research topic first.");
      return;
    }
    setLoading(true);
    setEditing(false);
    try {
      const res = await runResearch({ data: { topic, context, depth } });
      setMarkdown(res.markdown);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sammy AI could not research this topic.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        icon={Search}
        title="Research Assistant"
        subtitle="Explore workplace topics and get recommendations you can actually apply on the floor."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <Card className="surface-card h-fit border-none">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base">Research brief</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="topic">Research topic</Label>
              <Input
                id="topic"
                value={topic}
                placeholder="e.g. Ways to reduce coffee-shop food waste"
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="context">Context (optional)</Label>
              <Textarea
                id="context"
                rows={4}
                value={context}
                placeholder="Anything specific about our shop the research should account for."
                onChange={(e) => setContext(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Research depth</Label>
              <Select value={depth} onValueChange={setDepth}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Quick Overview">Quick Overview</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Detailed">Detailed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={run} disabled={loading} className="w-full">
              <Sparkles className="size-4" />
              {loading ? "Researching…" : "Research with AI"}
            </Button>

            <div>
              <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Example topics
              </p>
              <div className="flex flex-wrap gap-2">
                {topics.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(t)}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Recent at Sammy&apos;s
              </p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {recentResearch.map((r) => (
                  <li key={r}>· {r}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card border-none">
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="font-display text-base">Findings</CardTitle>
            <Badge variant="secondary" className="gap-1">
              <AlertTriangle className="size-3" /> AI-generated
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <ThinkingState label="Sammy AI is researching…" />
            ) : markdown ? (
              <>
                {editing ? (
                  <Textarea
                    rows={22}
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                    className="font-mono text-sm"
                  />
                ) : (
                  <div className="rounded-xl border border-border bg-background/60 p-5">
                    <AiMarkdown content={markdown} />
                  </div>
                )}
                <OutputToolbar
                  text={markdown}
                  editing={editing}
                  busy={loading}
                  onToggleEdit={() => setEditing((v) => !v)}
                  onRegenerate={run}
                  onClear={() => setMarkdown("")}
                />
              </>
            ) : (
              <EmptyState
                icon={Search}
                title="Nothing researched yet"
                description="Pick an example topic or write your own, then choose how deep the research should go."
              />
            )}
          </CardContent>
        </Card>
      </div>

      <ResponsibleAiNotice />
    </div>
  );
}
