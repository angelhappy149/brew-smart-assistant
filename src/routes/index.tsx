import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  ListChecks,
  Search,
  MessageSquare,
  CheckCircle2,
  CalendarDays,
  Users,
  Sparkles,
  ArrowRight,
  Gauge,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ResponsibleAiNotice } from "@/components/ResponsibleAi";
import { todayTasks, pendingEmails, upcomingMeetings, staffAvailability } from "@/lib/demo-data";
import heroImg from "@/assets/shop-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | Sammy's Coffee Shop AI Assistant" },
      {
        name: "description",
        content:
          "Daily operations dashboard for Sammy's Coffee Shop: tasks, emails, meetings and AI insights in one place.",
      },
      { property: "og:title", content: "Sammy's Coffee Shop AI Assistant" },
      {
        property: "og:description",
        content: "Brew better. Work smarter. An AI workplace productivity platform for café teams.",
      },
    ],
  }),
  component: Dashboard,
});

const quickActions = [
  { to: "/email", label: "Generate an Email", icon: Mail },
  { to: "/meetings", label: "Summarize Meeting Notes", icon: FileText },
  { to: "/planner", label: "Plan My Day", icon: ListChecks },
  { to: "/research", label: "Research Something", icon: Search },
  { to: "/assistant", label: "Ask AI", icon: MessageSquare },
] as const;

const priorityTone: Record<string, string> = {
  High: "bg-destructive/10 text-destructive border-destructive/20",
  Medium: "bg-warning/20 text-warning-foreground border-warning/30",
  Low: "bg-success/10 text-success border-success/20",
};

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="surface-card gap-0 border-none py-5 transition-shadow hover:shadow-[var(--shadow-lift)]">
      <CardContent className="px-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {label}
            </p>
            <p className="mt-2 font-display text-3xl font-semibold">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          </div>
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Icon className="size-[18px]" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  return (
    <div>
      <section className="surface-card relative mb-8 overflow-hidden border-none">
        <img
          src={heroImg}
          alt="Sammy's Coffee Shop counter in warm morning light"
          width={1600}
          height={900}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="relative bg-espresso/72 px-6 py-10 sm:px-10 sm:py-14">
          <Badge className="mb-4 border-none bg-caramel text-caramel-foreground">
            Brew better. Work smarter.
          </Badge>
          <h1 className="text-3xl text-cream sm:text-4xl">Good morning, Sammy 👋</h1>
          <p className="mt-3 max-w-xl text-sm text-cream/80 sm:text-base">
            Your AI-powered workplace assistant for running Sammy&apos;s Coffee Shop.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Today's Tasks" value="6" hint="3 due before noon" icon={CheckCircle2} />
        <StatCard label="Pending Emails" value="3" hint="1 waiting since yesterday" icon={Mail} />
        <StatCard label="Upcoming Meetings" value="3" hint="Next: Thu 08:00" icon={CalendarDays} />
        <StatCard label="Staff Tasks" value="9" hint="Across 5 team members" icon={Users} />
        <StatCard label="AI Productivity Score" value="87" hint="+6 vs last week" icon={Gauge} />
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {quickActions.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="surface-card group flex items-center gap-3 p-4 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Icon className="size-4" />
              </span>
              <span className="text-sm font-medium">{label}</span>
              <ArrowRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-3">
        <Card className="surface-card border-none lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-lg">Today at Sammy&apos;s</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {todayTasks.map((t) => (
              <div
                key={t.task}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3"
              >
                <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground">
                  {t.time}
                </span>
                <span className="min-w-0 flex-1 text-sm font-medium">{t.task}</span>
                <span className="text-xs text-muted-foreground">{t.owner}</span>
                <Badge variant="outline" className={priorityTone[t.priority]}>
                  {t.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="surface-card gradient-cream border-none">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-display text-base">
                <Sparkles className="size-4 text-caramel" />
                AI Insight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-foreground/85">
                “Three operational tasks are due today. Prioritising inventory and supplier
                communication first may help prevent delays.”
              </p>
            </CardContent>
          </Card>

          <Card className="surface-card border-none">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-base">Pending Emails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingEmails.map((e) => (
                <div key={e.subject} className="text-sm">
                  <p className="font-medium">{e.to}</p>
                  <p className="text-xs text-muted-foreground">
                    {e.subject} · {e.age}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="surface-card border-none">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-base">Upcoming Meetings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingMeetings.map((m) => (
                <div key={m.title} className="text-sm">
                  <p className="font-medium">{m.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.when} · {m.people}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className="surface-card border-none">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base">Staff Tasks & Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {staffAvailability.map((s) => (
              <div key={s.name} className="flex items-center gap-3 text-sm">
                <span className="flex size-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                  {s.name.charAt(0)}
                </span>
                <span className="font-medium">{s.name}</span>
                <span className="text-xs text-muted-foreground">{s.role}</span>
                <Badge variant="secondary" className="ml-auto">
                  {s.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="surface-card border-none">
          <CardHeader className="pb-2">
            <CardTitle className="font-display text-base">AI Productivity Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                <span>Task completion</span>
                <span>92%</span>
              </div>
              <Progress value={92} />
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                <span>Communication turnaround</span>
                <span>81%</span>
              </div>
              <Progress value={81} />
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                <span>Planning consistency</span>
                <span>88%</span>
              </div>
              <Progress value={88} />
            </div>
          </CardContent>
        </Card>
      </section>

      <ResponsibleAiNotice />
    </div>
  );
}
