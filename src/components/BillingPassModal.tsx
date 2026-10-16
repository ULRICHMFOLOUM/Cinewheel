"use client";

import { useState } from "react";
import { X, Shield, Smartphone, ArrowRight, CheckCircle2, Flame, Moon, Zap, Sparkles, Clock, Crown } from "lucide-react";
import { PLANS_CATALOG, PricingPlan, TARIFS } from "@/lib/billing";

interface BillingPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSpend: number;
  onRecharge: (amount: number, planName?: string) => void;
}

export default function BillingPassModal({
  isOpen,
  onClose,
  currentSpend,
  onRecharge,
}: BillingPassModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>(PLANS_CATALOG[2]); // Par défaut: Pass 24H (500 FCFA)
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const [paymentOperator, setPaymentOperator] = useState<"orange" | "mtn">("orange");
  const [phoneNumber, setPhoneNumber] = useState("699001122");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const finalAmount = customAmount !== null ? customAmount : selectedPlan.price;

  const handlePay = () => {
    setIsProcessing(true);
    // Simule la réception du Push USSD Fapshi
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onRecharge(finalAmount, selectedPlan.name);
        setIsSuccess(false);
        onClose();
      }, 1500);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0d0f16] p-6 text-white my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400">
            <Flame className="h-4 w-4" />
            <span>Paiement Direct Orange Money & MTN MoMo via Fapshi</span>
          </div>
          <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            Activez votre Pass Streaming
          </h2>
          <p className="text-xs text-white/60">
            Sans carte bancaire. Choisissez votre formule adaptée aux forfaits internet du Cameroun.
          </p>
        </div>

        {/* Current Gauge (0 à 1000 FCFA) */}
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/60">Solde consommé aujourd&apos;hui :</span>
            <span className="font-bold text-amber-400">{currentSpend} / {TARIFS.PLAFOND_MAX_FCFA} FCFA</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-500"
              style={{ width: `${Math.min(100, (currentSpend / TARIFS.PLAFOND_MAX_FCFA) * 100)}%` }}
            />
          </div>
        </div>

        {/* PLANS SELECTION CARDS */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white/80 uppercase tracking-wider">
              Sélectionnez votre formule :
            </label>
            <span className="text-[11px] font-semibold text-amber-400">
              Formule active : {selectedPlan.name}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PLANS_CATALOG.map((plan, idx) => {
              const isSelected = selectedPlan.id === plan.id && customAmount === null;
              const isVip = plan.id === "plan-mensuel";
              return (
                <div
                  key={plan.id}
                  onClick={() => {
                    setSelectedPlan(plan);
                    setCustomAmount(null);
                  }}
                  className={`relative flex flex-col justify-between cursor-pointer rounded-xl border p-3 transition ${
                    isVip ? "sm:col-span-2" : ""
                  } ${
                    isSelected
                      ? "border-red-500 bg-red-950/30 shadow-lg shadow-red-900/20 ring-1 ring-red-500/50"
                      : "border-white/10 bg-black/40 hover:border-white/20"
                  }`}
                >
                  {plan.badge && (
                    <span className="absolute -top-2.5 right-3 rounded-full bg-gradient-to-r from-red-600 to-amber-500 px-2 py-0.5 text-[9px] font-black uppercase text-white shadow">
                      {plan.badge}
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        {isVip && <Crown className="h-3.5 w-3.5 text-amber-400" />}
                        {plan.name}
                      </h4>
                      <span className="text-sm font-black text-amber-400">{plan.price} FCFA</span>
                    </div>
                    <p className="mt-1 text-[10px] text-white/50 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between border-t border-white/5 pt-2 text-[10px] text-white/60">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-red-400" />
                      {plan.durationHours}h d&apos;accès
                    </span>
                    <span className="text-emerald-400 font-semibold">
                      {plan.downloadsIncluded === "illimite" ? "Téléchargements Illimités" : `${plan.downloadsIncluded} Dl inclus`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Money Operator Picker */}
        <div className="mt-5 space-y-3">
          <label className="text-xs font-semibold text-white/80">Opérateur Mobile Money (Cameroun) :</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentOperator("orange")}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                paymentOperator === "orange"
                  ? "border-[#ff7900] bg-[#ff7900]/15"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <div className="h-3.5 w-3.5 rounded-full bg-[#ff7900]" />
              <div>
                <div className="text-xs font-bold text-white">Orange Money</div>
                <div className="text-[10px] text-white/50">Cameroun (*150#)</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentOperator("mtn")}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                paymentOperator === "mtn"
                  ? "border-[#ffcc00] bg-[#ffcc00]/15"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <div className="h-3.5 w-3.5 rounded-full bg-[#ffcc00]" />
              <div>
                <div className="text-xs font-bold text-white">MTN MoMo</div>
                <div className="text-[10px] text-white/50">Cameroun (*126#)</div>
              </div>
            </button>
          </div>

          {/* Phone Input for Push USSD */}
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs">
            <Smartphone className="h-4 w-4 text-white/50" />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Numéro Mobile Money (ex: 699112233)"
              className="w-full bg-transparent text-white outline-none font-mono"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handlePay}
          disabled={isProcessing || isSuccess}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 py-3.5 text-sm font-black text-white shadow-xl shadow-red-600/30 hover:brightness-110 active:scale-98 transition disabled:opacity-50"
        >
          {isProcessing ? (
            <span className="flex items-center gap-2 text-white">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Envoi du Push USSD sur votre téléphone...</span>
            </span>
          ) : isSuccess ? (
            <span className="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              <span>Paiement validé ! Votre pass est actif.</span>
            </span>
          ) : (
            <>
              <span>Payer {finalAmount} FCFA via Push USSD</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="mt-3 text-center text-[10px] text-white/40 flex items-center justify-center gap-1.5">
          <Shield className="h-3 w-3 text-emerald-400" />
          <span>Une notification apparaîtra sur votre écran pour taper votre code secret. Zéro risque.</span>
        </p>
      </div>
    </div>
  );
}
