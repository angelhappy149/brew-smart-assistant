import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Settings as SettingsIcon, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResponsibleAiNotice, RESPONSIBLE_AI_TEXT } from "@/components/ResponsibleAi";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings | Sammy's Coffee Shop AI Assistant" },
      {
        name: "description",
        content:
          "Workspace, assistant tone and responsible-AI settings for the Sammy's Coffee Shop assistant.",
      },
      { property: "og:title", content: "Settings | Sammy's Coffee Shop AI Assistant" },
      {
        property: "og:description",
        content: "Configure the workspace, default tone and responsible-AI reminders.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [business, setBusiness] = useState("Sammy's Coffee Shop");
  const [manager, setManager] = useState("Sammy");
  const [tone, setTone] = useState("Professional");
  const [reminders, setReminders] = useState(true);
  const [autoDrafts, setAutoDrafts] = useState(false);

  return (
    <div>
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        subtitle="Workspace details, assistant defaults and responsible-AI preferences."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="surface-card border-none">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base">Workspace</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="business">Business name</Label>
              <Input id="business" value={business} onChange={(e) => setBusiness(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="manager">Manager</Label>
              <Input id="manager" value={manager} onChange={(e) => setManager(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Default email tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Formal", "Friendly", "Professional", "Persuasive", "Apologetic"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => toast.success("Preferences saved for this session.")}>
              Save preferences
            </Button>
          </CardContent>
        </Card>

        <Card className="surface-card border-none">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-display text-base">
              <ShieldCheck className="size-4 text-caramel" /> Responsible AI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Show verification reminders</p>
                <p className="text-xs text-muted-foreground">
                  Display the responsible-AI notice on every AI page.
                </p>
              </div>
              <Switch checked={reminders} onCheckedChange={setReminders} />
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Keep drafts editable before sending</p>
                <p className="text-xs text-muted-foreground">
                  Never auto-send AI output without a human review step.
                </p>
              </div>
              <Switch checked={autoDrafts} onCheckedChange={setAutoDrafts} />
            </div>
            <Separator />
            <p className="rounded-xl bg-muted/60 p-3.5 text-xs leading-relaxed text-muted-foreground">
              {RESPONSIBLE_AI_TEXT}
            </p>
          </CardContent>
        </Card>
      </div>

      <ResponsibleAiNotice />
    </div>
  );
}
