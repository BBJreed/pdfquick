"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { TOOLS } from "@/lib/config";
import { setPendingFiles } from "@/lib/pending-files";

export function ToolGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {TOOLS.map((tool) => (
        <Link
          key={tool.id}
          href={tool.href}
          className="group rounded-3xl bg-card p-6 ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <span
            className="inline-block h-2 w-10 rounded-full"
            style={{ background: tool.accent }}
          />
          <h2 className="mt-4 text-xl font-semibold text-ink">{tool.name}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{tool.blurb}</p>
          <p className="mt-4 text-sm font-medium text-accent group-hover:underline">
            Open tool
          </p>
        </Link>
      ))}
    </div>
  );
}

export function HeroDrop() {
  const router = useRouter();

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        if (!files.length) return;
        setPendingFiles(files);
        const pdfs = files.filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
        const images = files.filter((f) => f.type.startsWith("image/"));
        const docs = files.filter((f) => f.name.toLowerCase().endsWith(".docx"));
        if (pdfs.length >= 2) router.push("/merge-pdf");
        else if (docs.length) router.push("/word-to-pdf");
        else if (images.length) router.push("/jpg-to-pdf");
        else router.push("/compress-pdf");
      }}
      className="rounded-3xl border-2 border-dashed border-line bg-card/70 px-6 py-10 text-center"
    >
      <p className="text-lg font-medium text-ink">Drop a file to start</p>
      <p className="mt-2 text-sm text-muted">
        PDFs go to merge or compress. Images become a PDF. Word files convert locally.
      </p>
    </div>
  );
}
