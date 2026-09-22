import { FileText, Download } from "lucide-react";
import type { DocumentAsset } from "@/lib/types";

export function DownloadList({ documents, className = "" }: { documents: DocumentAsset[]; className?: string }) {
  if (!documents.length) return null;
  return (
    <div className={className}>
      <h2 className="text-sm font-bold text-charcoal">Downloads</h2>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
        {documents.map((d) => (
          <li key={d.url}>
            <a href={d.url} target="_blank" rel="noopener" className="flex items-center gap-3 rounded-card border border-line px-4 py-3 text-sm font-semibold text-navy transition-colors hover:border-electric hover:bg-tint">
              <FileText className="size-5 shrink-0" aria-hidden />
              <span className="min-w-0 flex-1 truncate">{d.label}</span>
              <Download className="size-4 shrink-0 text-grey" aria-hidden />
              <span className="sr-only">(PDF, opens in new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
