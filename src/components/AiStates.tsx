import { Coffee } from "lucide-react";

export function ThinkingState({ label = "Sammy AI is thinking…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/40 px-6 py-12 text-center">
      <span className="flex size-11 animate-pulse items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Coffee className="size-5" />
      </span>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="w-full max-w-sm space-y-2">
        <div className="h-2.5 w-full animate-pulse rounded-full bg-muted" />
        <div className="h-2.5 w-4/5 animate-pulse rounded-full bg-muted" />
        <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-muted" />
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon: Icon = Coffee,
}: {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Icon className="size-5" />
      </span>
      <p className="font-display text-base font-semibold">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
