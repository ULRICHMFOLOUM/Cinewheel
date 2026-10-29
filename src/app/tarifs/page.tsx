"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Moon, Zap, Clock, Crown, Star, Flame, HelpCircle, Smartphone, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BillingPassModal from "@/components/BillingPassModal";
import { PLANS_CATALOG, TARIFS, calculerMontantTotal } from "@/lib/billing";

const PLAN_ICONS: Record<string, any> = {
  "plan-flash": Zap,
  "plan-nuit": Moon,
  "plan-24h": Clock,
  "plan-hebdo": Star,
  "plan-mensuel": Crown,
};

export default function TarifsPage() {
  const [currentSpend] = useState(100);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [hours, setHours] = useState(3);
  const [downloads, setDownloads] = useState(2);
  const sim = calculerMontantTotal(hours, downloads);

  return (
    <main className="min-h-screen bg-[#080a0f] text-white">
      <Navbar currentSpend={currentSpend} onOpenBilling={() => setIsBillingOpen(true)} />

      <div className="mx-auto max-w-6xl px-6 pt-28 pb-20">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-red-400 hover:text-red-300 mb-4 transition">
          <ArrowLeft className="h-3.5 w-3.5" /><span>Retour à l&apos;accueil</span>
        </Link>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-red-600/20 px-3 py-1 text-xs font-bold text-red-400 border border-red-500/30">
            <Flame className="h-4 w-4" /><span>SANS ABONNEMENT MENSUEL — PAYEZ UNIQUEMENT CE QUE VOUS REGARDEZ</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold italic text-white md:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            Choisissez votre Pass
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Paiement instantané via <strong>Orange Money</strong> ou <strong>MTN Mobile Money</strong>. Zéro carte bancaire. Zéro engagement.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-400 border border-emerald-500/30">
            <Sparkles className="h-4 w-4" />15 minutes d&apos;essai GRATUIT sur chaque titre — sans paiement
          </div>
        </div>

        {/* 5 Pricing Plans Grid */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {PLANS_CATALOG.map((plan) => {
            const Icon = PLAN_ICONS[plan.id] || Zap;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-5 transition ${
                  plan.popular
                    ? "border-red-500 bg-gradient-to-b from-red-950/40 via-[#121520] to-[#0c0e14] shadow-xl shadow-red-900/30 scale-105 z-10"
                    : "border-white/10 bg-[#0f121a]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-red-600 to-amber-500 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${plan.popular ? "bg-gradient-to-tr from-red-600 to-amber-500" : "bg-white/10"}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-white leading-snug">{plan.name}</h3>
                  {!plan.popular && plan.badge && (
                    <span className="text-[10px] text-amber-400 font-semibold">{plan.badge}</span>
                  )}
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">{plan.price}</span>
                    <span className="text-xs text-white/50">FCFA</span>
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-white/50">{plan.description}</p>
                  <ul className="mt-4 space-y-2 text-[11px] text-white/70">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{plan.durationHours}h d&apos;accès</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>{plan.downloadsIncluded === "illimite" ? "Téléchargements Illimités" : `${plan.downloadsIncluded} Téléchargements`}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>VF + VOSTFR inclus</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={() => setIsBillingOpen(true)}
                  className={`mt-5 w-full rounded-xl py-2.5 text-xs font-bold transition active:scale-95 ${
                    plan.popular
                      ? "bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg hover:brightness-110"
                      : "border border-white/20 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  Activer ce Pass
                </button>
              </div>
            );
          })}
        </div>

        {/* Comparison table */}
        <div className="mt-16 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-white/5 text-white/80">
              <tr>
                <th className="p-4 font-bold">Fonctionnalité</th>
                <th className="p-4 text-center">Flash (200F)</th>
                <th className="p-4 text-center bg-red-950/20 text-red-400">Nuit 300F ⭐</th>
                <th className="p-4 text-center bg-red-950/20 text-amber-400">24H 500F ⭐</th>
                <th className="p-4 text-center">Semaine 1500F</th>
                <th className="p-4 text-center">VIP Mensuel 3500F</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/70">
              {[
                ["Durée d'accès", "3h", "Nuit (7h)", "24h", "7 jours", "30 jours"],
                ["Streaming HD", "✓ 480p", "✓ 720p", "✓ 720p", "✓ Full HD", "✓ Full HD"],
                ["Téléchargements hors-ligne", "1", "Illimité", "5", "20", "Illimité"],
                ["Partage WhatsApp", "+1h", "+1h", "+1h", "+1h", "+1h"],
                ["VF + VOSTFR", "✓", "✓", "✓", "✓", "✓"],
                ["Qualité adaptative (data éco)", "✓", "✓", "✓", "✓", "✓"],
              ].map(([feature, ...values]) => (
                <tr key={feature as string} className="hover:bg-white/5">
                  <td className="p-4 font-medium text-white/90">{feature}</td>
                  {values.map((v, i) => (
                    <td key={i} className={`p-4 text-center ${i === 1 || i === 2 ? "bg-red-950/10" : ""}`}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Live Simulator */}
        <div className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-xl font-bold text-white">🧮 Simulez votre dépense en direct</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs text-white/70">
                  <span>Heures de visionnage ({hours} h) :</span>
                  <span className="font-bold text-red-400">{hours * TARIFS.PRIX_HEURE_STREAMING} FCFA</span>
                </div>
                <input type="range" min="1" max="15" value={hours} onChange={(e) => setHours(Number(e.target.value))} className="mt-2 w-full accent-red-600" />
              </div>
              <div>
                <div className="flex justify-between text-xs text-white/70">
                  <span>Téléchargements ({downloads}) :</span>
                  <span className="font-bold text-amber-400">{downloads * TARIFS.FRAIS_PAR_TELECHARGEMENT} FCFA</span>
                </div>
                <input type="range" min="0" max="15" value={downloads} onChange={(e) => setDownloads(Number(e.target.value))} className="mt-2 w-full accent-amber-500" />
              </div>
              <p className="text-[11px] text-white/40">Comparaison : Netflix coûte ~5 000 FCFA/mois sans Mobile Money. KAIJU STREAM = 0 engagement.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/40 p-6 text-center">
              <span className="text-xs uppercase text-white/50 tracking-wider">Montant facturé</span>
              <div className="mt-2 text-4xl font-black text-white">{sim.montantPlafonne} FCFA</div>
              {sim.plafondAtteint && (
                <div className="mt-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30 inline-block">
                  Plafond atteint ! Économie de {sim.economieRealisee} FCFA
                </div>
              )}
              <button onClick={() => setIsBillingOpen(true)} className="mt-4 w-full rounded-xl bg-gradient-to-r from-red-600 to-amber-600 py-2.5 text-xs font-bold text-white hover:brightness-110 transition">
                Payer maintenant via Sebpay (Orange / MTN)
              </button>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <HelpCircle className="h-5 w-5 text-red-400" />Questions Fréquentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { q: "L'essai gratuit de 15 min est-il vraiment gratuit ?", a: "Oui, totalement. Aucune carte, aucun numéro de téléphone requis. Les 15 minutes démarrent dès que vous lancez la lecture." },
              { q: "Comment fonctionne le Pass Nuit ?", a: "Valide de 23h à 06h, pendant les heures creuses où Orange et MTN offrent des forfaits internet économiques. Téléchargements illimités inclus." },
              { q: "Puis-je regarder sur mon téléphone Android ?", a: "Oui ! KAIJU STREAM est une PWA installable depuis Chrome ou Firefox. Un seul geste : Ajouter à l'écran d'accueil." },
              { q: "Que se passe-t-il quand je mets en pause ?", a: "Le compteur s'arrête immédiatement. Vous ne payez que le temps de lecture active réel, au centime près." },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h4 className="text-sm font-bold text-white">{q}</h4>
                <p className="mt-1.5 text-xs text-white/50 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
      <BillingPassModal isOpen={isBillingOpen} onClose={() => setIsBillingOpen(false)} currentSpend={currentSpend} onRecharge={() => setIsBillingOpen(false)} />
    </main>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.9 5.8L19 10l-5.1 3.1L15 19l-3-4.1L9 19l1.1-5.9L5 10l5.1-1.2z"/>
    </svg>
  );
}
