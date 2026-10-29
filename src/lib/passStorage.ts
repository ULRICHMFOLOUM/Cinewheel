"use client";

import { PLANS_CATALOG, PricingPlan, TARIFS } from "./billing";

export interface UserPass {
  planId: string;
  planName: string;
  activatedAt: number; // timestamp ms
  expiresAt: number; // timestamp ms
  downloadsRemaining: number | "illimite";
  totalSpent: number;
  transactionId?: string;
  reference?: string;
  operator?: string;
  phone?: string;
}

const STORAGE_KEY = "kaiju_user_pass";
const SPEND_KEY = "kaiju_current_spend";

export function getStoredPass(): UserPass | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const pass: UserPass = JSON.parse(raw);
    if (Date.now() > pass.expiresAt) {
      // Pass expiré
      return null;
    }
    return pass;
  } catch {
    return null;
  }
}

export function saveActivePass(
  plan: PricingPlan,
  transactionId?: string,
  reference?: string,
  operator?: string,
  phone?: string
): UserPass {
  const now = Date.now();
  const durationMs = plan.durationHours * 3600 * 1000;
  const pass: UserPass = {
    planId: plan.id,
    planName: plan.name,
    activatedAt: now,
    expiresAt: now + durationMs,
    downloadsRemaining: plan.downloadsIncluded,
    totalSpent: plan.price,
    transactionId,
    reference,
    operator,
    phone,
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pass));
      const current = getStoredSpend();
      localStorage.setItem(SPEND_KEY, (current + plan.price).toString());
      window.dispatchEvent(new Event("kaiju_pass_updated"));
    } catch (e) {
      console.error("Erreur sauvegarde pass:", e);
    }
  }

  return pass;
}

export function getStoredSpend(): number {
  if (typeof window === "undefined") return 100;
  try {
    const raw = localStorage.getItem(SPEND_KEY);
    return raw ? Number(raw) : 100;
  } catch {
    return 100;
  }
}

export function formatTimeRemaining(expiresAt: number): string {
  const diff = expiresAt - Date.now();
  if (diff <= 0) return "Expiré";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}j ${hours % 24}h restantes`;
  }
  return `${hours}h ${minutes}m restantes`;
}
