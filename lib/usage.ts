import { PRICING } from "./config";
import type { Plan } from "./session";

export const USAGE_KEY = "pdfquick_usage_v1";

export type LocalUsage = {
  date: string;
  count: number;
};

export function todayStamp(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function emptyUsage(): LocalUsage {
  return { date: todayStamp(), count: 0 };
}

export function normalizeUsage(raw: LocalUsage | null | undefined): LocalUsage {
  if (!raw || raw.date !== todayStamp()) return emptyUsage();
  return { date: raw.date, count: Math.max(0, Number(raw.count) || 0) };
}

export function remainingFree(usage: LocalUsage, plan: Plan) {
  if (plan !== "free") return Infinity;
  return Math.max(0, PRICING.freePerDay - usage.count);
}

export function canProcess(usage: LocalUsage, plan: Plan) {
  return remainingFree(usage, plan) > 0 || plan !== "free";
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
