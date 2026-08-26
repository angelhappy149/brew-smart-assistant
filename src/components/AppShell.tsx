import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Mail,
  FileText,
  ListChecks,
  Search,
  MessageSquare,
  Coffee,
  Settings,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Smart Email", icon: Mail },
  { to: "/meetings", label: "Meeting Notes", icon: FileText },
  { to: "/planner", label: "Task Planner", icon: ListChecks },
  { to: "/research", label: "Research Assistant", icon: Search },
  { to: "/assistant", label: "AI Assistant", icon: MessageSquare },
  { to: "/menu", label: "Menu & Operations", icon: Coffee },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {nav.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{
            className: "bg-sidebar-accent text-sidebar-accent-foreground",
          }}
        >
          <Icon className="size-[18px] shrink-0" />
          <span className="truncate">{label}</span>
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3 px-1">
      <span className="flex size-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
        <Coffee className="size-5" />
      </span>
      <div className="leading-tight">
        <p className="font-display text-[15px] font-semibold text-sidebar-accent-foreground">
          Sammy&apos;s Coffee Shop
        </p>
        <p className="text-xs text-sidebar-foreground/60">Brew better. Work smarter.</p>
      </div>
    </div>
  );
}

function SidebarFooter() {
  return (
    <div className="mt-auto space-y-3 pt-4">
      <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/60 p-3">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
            S
          </span>
          <div className="leading-tight">
            <p className="text-sm font-medium text-sidebar-accent-foreground">Sammy | Manager</p>
            <p className="text-xs text-sidebar-foreground/60">Sammy&apos;s Coffee Shop</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col gap-6 border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <Brand />
        <NavLinks />
        <SidebarFooter />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Coffee className="size-4.5" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold">Sammy&apos;s Coffee Shop</p>
            <p className="text-[11px] text-muted-foreground">Brew better. Work smarter.</p>
          </div>
        </div>
        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((v) => !v)}
          className="flex size-10 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-accent"
        >
          {open ? <X className="size-5" /> : <MenuIcon className="size-5" />}
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-espresso/50"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 flex w-[82%] max-w-xs flex-col gap-6 bg-sidebar p-4">
            <Brand />
            <NavLinks onNavigate={() => setOpen(false)} />
            <SidebarFooter />
          </div>
        </div>
      )}

      <main className={cn("lg:pl-64")}>
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="mb-6 flex items-start gap-4">
      {Icon && (
        <span className="hidden size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground sm:flex">
          <Icon className="size-5" />
        </span>
      )}
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-[15px]">{subtitle}</p>
      </div>
    </div>
  );
}
