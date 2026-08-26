import { Fragment } from "react";

function inline(text: string, keyBase: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={`${keyBase}-${i}`}>{p.slice(2, -2)}</strong>
    ) : (
      <Fragment key={`${keyBase}-${i}`}>{p}</Fragment>
    ),
  );
}

/** Small dependency-free renderer for the markdown subset our prompts request. */
export function AiMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];

  const flush = (key: string) => {
    if (list.length) {
      blocks.push(
        <ul key={`ul-${key}`}>
          {list.map((li, i) => (
            <li key={i}>{inline(li, `${key}-${i}`)}</li>
          ))}
        </ul>,
      );
      list = [];
    }
  };

  lines.forEach((raw, idx) => {
    const line = raw.trim();
    if (!line) {
      flush(String(idx));
      return;
    }
    if (/^#{3,}\s/.test(line)) {
      flush(String(idx));
      blocks.push(<h3 key={idx}>{line.replace(/^#+\s/, "")}</h3>);
      return;
    }
    if (/^#{1,2}\s/.test(line)) {
      flush(String(idx));
      blocks.push(<h2 key={idx}>{line.replace(/^#+\s/, "")}</h2>);
      return;
    }
    if (/^([-*•]|\d+\.)\s/.test(line)) {
      list.push(line.replace(/^([-*•]|\d+\.)\s/, ""));
      return;
    }
    flush(String(idx));
    blocks.push(<p key={idx}>{inline(line, String(idx))}</p>);
  });
  flush("end");

  return <div className="ai-prose text-sm text-foreground">{blocks}</div>;
}
