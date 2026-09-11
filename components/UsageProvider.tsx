"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  canProcess,
  emptyUsage,
  normalizeUsage,
  remainingFree,
  USAGE_KEY,
  type LocalUsage,
} from "@/lib/usage";
import type { Plan } from "@/lib/session";

type UsageContextValue = {
  plan: Plan;
  usage: LocalUsage;
  remaining: number;
  allowed: boolean;
  ready: boolean;
  recordUse: () => void;
  refresh: () => Promise<void>;
};

const UsageContext = createContext<UsageContextValue | null>(null);

function readLocal(): LocalUsage {
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    return normalizeUsage(raw ? (JSON.parse(raw) as LocalUsage) : null);
  } catch {
    return emptyUsage();
  }
}

export function UsageProvider({
  children,
  initialPlan,
}: {
  children: React.ReactNode;
  initialPlan: Plan;
}) {
  const [plan, setPlan] = useState<Plan>(initialPlan);
  const [usage, setUsage] = useState<LocalUsage>(emptyUsage);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    setUsage(readLocal());
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { plan?: Plan };
        if (data.plan === "monthly" || data.plan === "lifetime" || data.plan === "free") {
          setPlan(data.plan);
        }
      }
    } catch {
      // offline / first paint
    }
  }, []);

  useEffect(() => {
    setUsage(readLocal());
    setReady(true);
    void refresh();
  }, [refresh]);

  const recordUse = useCallback(() => {
    setUsage((prev) => {
      const next = normalizeUsage(prev);
      next.count += 1;
      localStorage.setItem(USAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo<UsageContextValue>(
    () => ({
      plan,
      usage,
      remaining: remainingFree(usage, plan),
      allowed: canProcess(usage, plan),
      ready,
      recordUse,
      refresh,
    }),
    [plan, usage, ready, recordUse, refresh],
  );

  return <UsageContext.Provider value={value}>{children}</UsageContext.Provider>;
}

export function useUsage() {
  const ctx = useContext(UsageContext);
  if (!ctx) throw new Error("useUsage must be used within UsageProvider");
  return ctx;
}
