import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListChecks, Plus, Sparkles, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { createPlan, type DayPlan } from "@/lib/ai.functions";
import { seedPlannerTasks, type Priority } from "@/lib/demo-data";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | Sammy's Coffee Shop" },
      {
        name: "description",
        content:
          "Turn a list of café tasks into a prioritised daily schedule based on urgency, deadlines and effort.",
      },
      { property: "og:title", content: "AI Task Planner | Sammy's Coffee Shop" },
      {
        property: "og:description",
        content: "Prioritised daily plans for a busy coffee shop team.",
      },
    ],
  }),
  component: PlannerPage,
});

type Row = { task: string; deadline: string; priority: Priority; estimate: string };

const tone: Record<string, string> = {
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-warning/20 text-warning-foreground border-warning/30",
  Low: "bg-success/10 text-success border-success/20",
};

function PlannerPage() {
  const [rows, setRows] = useState<Row[]>(seedPlannerTasks);
  const [draft, setDraft] = useState<Row>({
    task: "",
    deadline: "",
    priority: "Medium",
    estimate: "",
  });
  const [horizon, setHorizon] = useState("day");
  const [plan, setPlan] = useState<DayPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const addRow = () => {
    if (!draft.task.trim()) {
      toast.error("Give the task a name.");
      return;
    }
    setRows((r) => [...r, draft]);
    setDraft({ task: "", deadline: "", priority: "Medium", estimate: "" });
  };

  const run = async () => {
    if (rows.length === 0) {
      toast.error("Add at least one task.");
      return;
    }
    setLoading(true);
    try {
      setPlan(await createPlan({ data: { tasks: rows, horizon } }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sammy AI could not build a plan.");
    } finally {
      setLoading(false);
    }
  };

  const planText = plan
    ? [
        "TODAY'S PRIORITIES",
        ...plan.today.map((t) => `${t.time} — ${t.task} (${t.priority}, ${t.duration}) — ${t.why}`),
        "",
        "UPCOMING",
        ...plan.upcoming.map((t) => `${t.task} — due ${t.deadline} (${t.priority})`),
        "",
        plan.note,
      ].join("\n")
    : "";

  return (
    <div>
      <PageHeader
        icon={ListChecks}
        title="Task Planner"
        subtitle="Add your workplace tasks and let AI sequence them around the service rush."
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
        <Card className="surface-card h-fit border-none">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base">Your tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 rounded-xl border border-border bg-background/60 p-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="task">Task</Label>
                <Input
                  id="task"
                  value={draft.task}
                  placeholder="e.g. Check inventory"
                  onChange={(e) => setDraft({ ...draft, task: e.target.value })}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    value={draft.deadline}
                    placeholder="Today"
                    onChange={(e) => setDraft({ ...draft, deadline: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Importance</Label>
                  <Select
                    value={draft.priority}
                    onValueChange={(v) => setDraft({ ...draft, priority: v as Priority })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="estimate">Est. time</Label>
                  <Input
                    id="estimate"
                    value={draft.estimate}
                    placeholder="30 min"
                    onChange={(e) => setDraft({ ...draft, estimate: e.target.value })}
                  />
                </div>
              </div>
              <Button variant="secondary" onClick={addRow}>
                <Plus className="size-4" /> Add task
              </Button>
            </div>

            <div className="space-y-2">
              {rows.map((r, i) => (
                <div
                  key={`${r.task}-${i}`}
                  className="flex items-center gap-2.5 rounded-lg border border-border bg-background/60 px-3 py-2.5"
                >
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{r.task}</span>
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    {r.deadline || "—"} · {r.estimate || "—"}
                  </span>
                  <Badge variant="outline" className={tone[r.priority]}>
                    {r.priority}
                  </Badge>
                  <button
                    type="button"
                    aria-label={`Remove ${r.task}`}
                    onClick={() => setRows((rs) => rs.filter((_, idx) => idx !== i))}
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Select value={horizon} onValueChange={setHorizon}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Daily plan</SelectItem>
                  <SelectItem value="week">Weekly plan</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={run} disabled={loading}>
                <Sparkles className="size-4" />
                {loading ? "Planning…" : "Create My Plan"}
              </Button>
              <Button variant="ghost" onClick={() => setRows([])}>
                Clear all
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          {loading ? (
            <Card className="surface-card border-none">
              <CardContent className="pt-6">
                <ThinkingState label="Sammy AI is building your schedule…" />
              </CardContent>
            </Card>
          ) : !plan ? (
            <Card className="surface-card border-none">
              <CardContent className="pt-6">
                <EmptyState
                  icon={ListChecks}
                  title="No plan yet"
                  description="Your demo task list is ready — press Create My Plan to see a prioritised schedule."
                />
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="surface-card border-none">
                <CardHeader className="pb-3">
                  <CardTitle className="font-display text-base">Today&apos;s Priorities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-0">
                  {plan.today.map((t, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className="mt-1.5 size-2.5 rounded-full bg-caramel" />
                        {i < plan.today.length - 1 && <span className="w-px flex-1 bg-border" />}
                      </div>
                      <div className="flex-1 pb-5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">{t.time}</span>
                          <span className="text-sm font-semibold">{t.task}</span>
                          <Badge variant="outline" className={tone[t.priority]}>
                            {t.priority}
                          </Badge>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="size-3" />
                            {t.duration}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{t.why}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="surface-card border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-base">Upcoming Tasks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {plan.upcoming.length === 0 && (
                    <p className="text-sm text-muted-foreground">Everything fits into today.</p>
                  )}
                  {plan.upcoming.map((t, i) => (
                    <div
                      key={i}
                      className="flex flex-wrap items-center gap-2.5 rounded-lg border border-border bg-background/60 px-4 py-2.5"
                    >
                      <span className="min-w-0 flex-1 text-sm font-medium">{t.task}</span>
                      <span className="text-xs text-muted-foreground">Due {t.deadline}</span>
                      <Badge variant="outline" className={tone[t.priority]}>
                        {t.priority}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {plan.note && (
                <Card className="surface-card gradient-cream border-none">
                  <CardContent className="pt-6 text-sm">{plan.note}</CardContent>
                </Card>
              )}

              <OutputToolbar text={planText} onRegenerate={run} onClear={() => setPlan(null)} />
            </>
          )}
        </div>
      </div>

      <ResponsibleAiNotice />
    </div>
  );
}
