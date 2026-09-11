"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  FREE_FILE_BYTES,
  PRO_FILE_BYTES,
  getTool,
  type ToolId,
} from "@/lib/config";
import { takePendingFiles } from "@/lib/pending-files";
import {
  downloadResult,
  runTool,
  type CompressLevel,
  type ProcessResult,
} from "@/lib/pdf";
import { formatBytes } from "@/lib/usage";
import { PaywallModal } from "./PaywallModal";
import { useUsage } from "./UsageProvider";

export function ToolWorkspace({ toolId }: { toolId: ToolId }) {
  const tool = getTool(toolId);
  const inputRef = useRef<HTMLInputElement>(null);
  const { plan, remaining, allowed, recordUse } = useUsage();
  const [files, setFiles] = useState<File[]>([]);
  const [drag, setDrag] = useState(false);
  const [level, setLevel] = useState<CompressLevel>("medium");
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paywall, setPaywall] = useState(false);

  useEffect(() => {
    const pending = takePendingFiles();
    if (pending.length) setFiles(pending);
  }, []);

  const maxBytes = plan === "free" ? FREE_FILE_BYTES : PRO_FILE_BYTES;

  function addFiles(list: FileList | File[]) {
    const incoming = Array.from(list);
    setError(null);
    setResult(null);
    setStatus("idle");
    const next = tool.multiple ? [...files, ...incoming] : incoming.slice(0, 1);
    const tooBig = next.find((f) => f.size > maxBytes);
    if (tooBig) {
      setError(
        `${tooBig.name} is ${formatBytes(tooBig.size)}. Free files cap at ${formatBytes(maxBytes)}. Unlock for 100 MB.`,
      );
      if (plan === "free") setPaywall(true);
      return;
    }
    setFiles(next);
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= files.length) return;
    const copy = [...files];
    const [item] = copy.splice(index, 1);
    copy.splice(target, 0, item);
    setFiles(copy);
  }

  const ready = files.length >= tool.minFiles;

  const hint = useMemo(() => {
    if (tool.multiple) return "Drop files here, or click to browse";
    return "Drop a file here, or click to browse";
  }, [tool.multiple]);

  async function process() {
    if (!ready) return;
    if (!allowed) {
      setPaywall(true);
      return;
    }
    setStatus("working");
    setError(null);
    try {
      const out = await runTool(tool.id, files, { level });
      recordUse();
      setResult(out);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        {tool.searchTerm}
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-ink sm:text-5xl">
        {tool.headline}
      </h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-muted">{tool.blurb}</p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`mt-8 cursor-pointer rounded-3xl border-2 border-dashed px-6 py-14 text-center transition ${
          drag ? "border-accent bg-accent/5" : "border-line bg-card hover:border-accent/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={tool.accept}
          multiple={tool.multiple}
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <p className="text-lg font-medium text-ink">{hint}</p>
        <p className="mt-2 text-sm text-muted">
          Files stay on this device. {plan === "free" ? `${remaining} free tasks left today.` : "Unlimited."}
        </p>
      </div>

      {files.length > 0 ? (
        <ul className="mt-6 space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-2xl bg-card px-4 py-3 ring-1 ring-line"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">{file.name}</p>
                <p className="text-xs text-muted">{formatBytes(file.size)}</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {tool.multiple && files.length > 1 ? (
                  <>
                    <button type="button" onClick={() => move(index, -1)} className="rounded-lg px-2 py-1 hover:bg-paper">
                      Up
                    </button>
                    <button type="button" onClick={() => move(index, 1)} className="rounded-lg px-2 py-1 hover:bg-paper">
                      Down
                    </button>
                  </>
                ) : null}
                <button
                  type="button"
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                  className="rounded-lg px-2 py-1 text-accent hover:bg-paper"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {tool.id === "compress" ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {(["low", "medium", "high"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setLevel(value)}
              className={`rounded-full px-4 py-2 text-sm capitalize ${
                level === value ? "bg-ink text-card" : "bg-card text-ink ring-1 ring-line"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={process}
          disabled={!ready || status === "working"}
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "working" ? "Working…" : tool.verb}
        </button>
        {files.length ? (
          <button
            type="button"
            onClick={() => {
              setFiles([]);
              setResult(null);
              setStatus("idle");
              setError(null);
            }}
            className="text-sm text-muted hover:text-ink"
          >
            Clear
          </button>
        ) : null}
      </div>

      {error ? <p className="mt-4 text-sm text-accent">{error}</p> : null}

      {result && status === "done" ? (
        <div className="mt-8 rounded-3xl bg-good/10 p-5 ring-1 ring-good/20">
          <p className="font-medium text-ink">Ready — {result.filename}</p>
          {result.note ? <p className="mt-1 text-sm text-muted">{result.note}</p> : null}
          <button
            type="button"
            onClick={() => downloadResult(result)}
            className="mt-4 rounded-full bg-good px-5 py-2.5 text-sm font-semibold text-white hover:bg-good/90"
          >
            Download
          </button>
        </div>
      ) : null}

      <PaywallModal open={paywall} onClose={() => setPaywall(false)} />
    </div>
  );
}
