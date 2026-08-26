import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Wand2 } from "lucide-react";
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
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | Sammy's Coffee Shop" },
      {
        name: "description",
        content:
          "Generate professional workplace emails for suppliers, staff and customers with structured AI prompting.",
      },
      { property: "og:title", content: "Smart Email Generator | Sammy's Coffee Shop" },
      {
        property: "og:description",
        content: "Draft supplier, staff and customer emails in seconds with Sammy AI.",
      },
    ],
  }),
  component: EmailPage,
});

const tones = ["Formal", "Friendly", "Professional", "Persuasive", "Apologetic"];

const useCases = [
  {
    label: "Supplier follow-up",
    recipient: "Cape Bean Roasters",
    subject: "Follow-up on order #4821",
    purpose:
      "Our coffee bean delivery (order #4821) is three days late. Ask for a new delivery date and request a credit for the delay.",
    tone: "Professional",
  },
  {
    label: "Staff communication",
    recipient: "Floor team",
    subject: "New takeaway till trial",
    purpose:
      "Tell the team we are trialling a dedicated takeaway till from Monday for two weeks, and that Thabo is running the trial.",
    tone: "Friendly",
  },
  {
    label: "Customer response",
    recipient: "Mr. Daniels",
    subject: "Thank you for your feedback",
    purpose:
      "Respond to a customer who waited 9 minutes during the morning rush. Apologise and explain what we are changing.",
    tone: "Apologetic",
  },
  {
    label: "Meeting invitation",
    recipient: "Full team",
    subject: "Weekly team meeting — Thursday 08:00",
    purpose:
      "Invite the team to Thursday's 08:00 weekly meeting covering queue times, bakery waste and the winter menu.",
    tone: "Professional",
  },
  {
    label: "Order confirmation",
    recipient: "Rise & Bake Co.",
    subject: "Confirming next week's pastry order",
    purpose:
      "Confirm next week's pastry order with a 20% reduction on afternoon muffins, delivered daily at 06:00.",
    tone: "Formal",
  },
  {
    label: "Schedule change",
    recipient: "Nomsa D.",
    subject: "Friday shift swap approved",
    purpose: "Confirm Nomsa's Friday shift swap with Sipho and note the updated weekly schedule.",
    tone: "Friendly",
  },
];

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("Professional");
  const [output, setOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!recipient.trim() || !purpose.trim()) {
      toast.error("Add a recipient and what the email should say.");
      return;
    }
    setLoading(true);
    setEditing(false);
    try {
      const res = await generateEmail({ data: { recipient, subject, purpose, tone } });
      setOutput(res.text);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sammy AI could not draft this email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        icon={Mail}
        title="Smart Email"
        subtitle="Draft professional workplace emails for suppliers, staff and customers."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <Card className="surface-card h-fit border-none">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base">Email brief</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="e.g. Cape Bean Roasters"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Optional — AI can write one"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="purpose">Purpose / message</Label>
              <Textarea
                id="purpose"
                rows={6}
                placeholder="What should this email achieve?"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={run} disabled={loading} className="w-full">
              <Wand2 className="size-4" />
              {loading ? "Generating…" : "Generate Email"}
            </Button>

            <div>
              <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Example use cases
              </p>
              <div className="flex flex-wrap gap-2">
                {useCases.map((u) => (
                  <button
                    key={u.label}
                    type="button"
                    onClick={() => {
                      setRecipient(u.recipient);
                      setSubject(u.subject);
                      setPurpose(u.purpose);
                      setTone(u.tone);
                    }}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card border-none">
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="font-display text-base">Generated email</CardTitle>
            {output && <Badge variant="secondary">{tone} tone</Badge>}
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <ThinkingState label="Sammy AI is drafting your email…" />
            ) : output ? (
              <>
                {editing ? (
                  <Textarea
                    value={output}
                    onChange={(e) => setOutput(e.target.value)}
                    rows={18}
                    className="font-mono text-sm"
                  />
                ) : (
                  <div className="rounded-xl border border-border bg-background/60 p-5 text-sm whitespace-pre-wrap">
                    {output}
                  </div>
                )}
                <OutputToolbar
                  text={output}
                  editing={editing}
                  busy={loading}
                  onToggleEdit={() => setEditing((v) => !v)}
                  onRegenerate={run}
                  onClear={() => {
                    setOutput("");
                    setEditing(false);
                  }}
                />
              </>
            ) : (
              <EmptyState
                icon={Mail}
                title="No draft yet"
                description="Fill in the brief or pick an example use case, then generate a draft you can edit before sending."
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="hidden">
        <AiMarkdown content="" />
      </div>
      <ResponsibleAiNotice />
    </div>
  );
}
