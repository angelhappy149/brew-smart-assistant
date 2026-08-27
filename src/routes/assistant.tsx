import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { MessageSquare, SendHorizonal, Coffee } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResponsibleAiNotice } from "@/components/ResponsibleAi";
import { AiMarkdown } from "@/components/AiMarkdown";
import { askSammyAi } from "@/lib/ai.functions";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Sammy AI Assistant | Sammy's Coffee Shop" },
      {
        name: "description",
        content:
          "Chat with Sammy AI — an in-house workplace assistant for planning, communication and café operations.",
      },
      { property: "og:title", content: "Sammy AI Assistant | Sammy's Coffee Shop" },
      {
        property: "og:description",
        content: "Ask the in-house AI assistant anything about running the shop.",
      },
    ],
  }),
  component: AssistantPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const WELCOME: Msg = {
  role: "assistant",
  content: "Hi Sammy! I'm your AI workplace assistant. What would you like to work on?",
};

const suggestions = [
  "Help me plan today's tasks.",
  "Write an email to our coffee supplier.",
  "Summarize these meeting notes.",
  "Give me ideas to reduce food waste.",
  "Help me prepare for tomorrow's staff meeting.",
];

function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const value = text.trim();
    if (!value || loading) return;
    const next = [...messages, { role: "user" as const, content: value }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await askSammyAi({
        data: { messages: next.filter((m) => m !== WELCOME) },
      });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sammy AI could not reply.");
      setMessages(next);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        icon={MessageSquare}
        title="Sammy AI Assistant"
        subtitle="Your workplace assistant for planning, writing and everyday café problem solving."
      />

      <Card className="surface-card overflow-hidden border-none py-0">
        <CardContent className="flex h-[65vh] min-h-[480px] flex-col p-0">
          <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
            {messages.map((m, i) =>
              m.role === "assistant" ? (
                <div key={i} className="flex gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Coffee className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <AiMarkdown content={m.content} />
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                    {m.content}
                  </div>
                </div>
              ),
            )}
            {loading && (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex size-8 animate-pulse items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Coffee className="size-4" />
                </span>
                Sammy AI is thinking…
              </div>
            )}
            <div ref={endRef} />
          </div>

          {messages.length <= 1 && (
            <div className="flex flex-wrap gap-2 border-t border-border px-4 py-3 sm:px-6">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="flex items-end gap-2 border-t border-border bg-muted/40 p-3 sm:p-4"
          >
            <Textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              placeholder="Ask about tasks, emails, staff, suppliers…"
              className="max-h-40 min-h-11 flex-1 resize-none bg-background"
            />
            <Button type="submit" size="icon" className="size-11" disabled={loading}>
              <SendHorizonal className="size-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardContent>
      </Card>

      <ResponsibleAiNotice />
    </div>
  );
}
