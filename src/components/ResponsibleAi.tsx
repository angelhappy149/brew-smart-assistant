import { Info, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const RESPONSIBLE_AI_TEXT =
  "AI-generated content may contain errors or incomplete information. Review and verify important information before using it for workplace decisions or communication.";

export function ResponsibleAiNotice() {
  return (
    <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-muted/60 p-3.5 text-xs text-muted-foreground">
      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-caramel" />
      <p className="leading-relaxed">
        <span className="font-semibold text-foreground">Responsible AI Notice · </span>
        {RESPONSIBLE_AI_TEXT}
      </p>
      <Dialog>
        <DialogTrigger
          aria-label="More about responsible AI"
          className="ml-auto shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Info className="size-4" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Responsible AI at Sammy&apos;s</DialogTitle>
            <DialogDescription>How we expect the team to use AI output.</DialogDescription>
          </DialogHeader>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>• Treat every AI output as a first draft, never as a final decision.</li>
            <li>• Verify names, prices, dates and supplier commitments before sending.</li>
            <li>• Never paste customer personal details or payment data into the assistant.</li>
            <li>• Edit tone and facts so communication still sounds like our shop.</li>
            <li>• Flag anything that looks wrong so we can improve the prompts.</li>
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}
