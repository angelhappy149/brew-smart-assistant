import { createFileRoute } from "@tanstack/react-router";
import { Coffee, Package, Truck, Users, Flag } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { menu, inventory, suppliers, staffAvailability, todayTasks } from "@/lib/demo-data";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu & Operations | Sammy's Coffee Shop" },
      {
        name: "description",
        content:
          "Sammy's Coffee Shop menu with Rand pricing, plus live inventory, supplier and staffing status.",
      },
      { property: "og:title", content: "Menu & Operations | Sammy's Coffee Shop" },
      {
        property: "og:description",
        content: "Coffee, cold drinks, tea and bakery — plus the daily operations board.",
      },
    ],
  }),
  component: MenuPage,
});

const statusTone: Record<string, string> = {
  Low: "bg-destructive/10 text-destructive border-destructive/20",
  Monitor: "bg-warning/20 text-warning-foreground border-warning/30",
  Healthy: "bg-success/10 text-success border-success/20",
};

function MenuPage() {
  return (
    <div>
      <PageHeader
        icon={Coffee}
        title="Menu & Operations"
        subtitle="What we serve, and how the shop is running today."
      />

      <Tabs defaultValue={menu[0].category}>
        <TabsList className="mb-5 flex w-full flex-wrap justify-start gap-1 rounded-xl">
          {menu.map((g) => (
            <TabsTrigger key={g.category} value={g.category} className="rounded-lg">
              {g.category}
            </TabsTrigger>
          ))}
        </TabsList>

        {menu.map((g) => (
          <TabsContent key={g.category} value={g.category}>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {g.items.map((item) => (
                <Card
                  key={item.name}
                  className="surface-card gap-0 overflow-hidden border-none py-0 transition-shadow hover:shadow-[var(--shadow-lift)]"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    width={800}
                    height={600}
                    loading="lazy"
                    className="h-40 w-full object-cover"
                  />
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold">{item.name}</h3>
                      <span className="shrink-0 rounded-full bg-accent px-2.5 py-1 text-sm font-semibold text-accent-foreground">
                        {item.price}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">Operations</h2>
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="surface-card border-none">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-display text-base">
                <Package className="size-4 text-caramel" /> Inventory status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5">
              {inventory.map((i) => (
                <div key={i.item}>
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                    <span className="font-medium">{i.item}</span>
                    <Badge variant="outline" className={statusTone[i.status]}>
                      {i.status}
                    </Badge>
                  </div>
                  <Progress value={i.level} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="surface-card border-none">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-display text-base">
                <Truck className="size-4 text-caramel" /> Supplier status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {suppliers.map((s) => (
                <div
                  key={s.name}
                  className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-background/60 px-4 py-2.5 text-sm"
                >
                  <span className="font-medium">{s.name}</span>
                  <span className="text-xs text-muted-foreground">{s.item}</span>
                  <Badge variant="secondary" className="ml-auto">
                    {s.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="surface-card border-none">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 font-display text-base">
                <Users className="size-4 text-caramel" /> Staff availability
              </CardTitle>
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
              <CardTitle className="flex items-center gap-2 font-display text-base">
                <Flag className="size-4 text-caramel" /> Daily priorities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {todayTasks.slice(0, 4).map((t) => (
                <div key={t.task} className="flex items-center gap-3 text-sm">
                  <span className="font-mono text-xs text-muted-foreground">{t.time}</span>
                  <span className="min-w-0 flex-1 font-medium">{t.task}</span>
                  <Badge variant="secondary">{t.priority}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
