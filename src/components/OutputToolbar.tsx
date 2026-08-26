import { Copy, Pencil, RefreshCw, Trash2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function OutputToolbar({
  text,
  onRegenerate,
  onClear,
  onToggleEdit,
  editing,
  busy,
}: {
  text: string;
  onRegenerate?: () => void;
  onClear?: () => void;
  onToggleEdit?: () => void;
  editing?: boolean;
  busy?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy — please select and copy manually.");
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="secondary" size="sm" onClick={copy}>
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        Copy
      </Button>
      {onToggleEdit && (
        <Button type="button" variant="secondary" size="sm" onClick={onToggleEdit}>
          <Pencil className="size-4" />
          {editing ? "Done" : "Edit"}
        </Button>
      )}
      {onRegenerate && (
        <Button type="button" variant="secondary" size="sm" onClick={onRegenerate} disabled={busy}>
          <RefreshCw className="size-4" />
          Regenerate
        </Button>
      )}
      {onClear && (
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          <Trash2 className="size-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
