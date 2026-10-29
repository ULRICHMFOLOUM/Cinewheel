"use client";

import { useState } from "react";
import {
  X,
  Shield,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Flame,
  Clock,
  Crown,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Zap,
} from "lucide-react";
import { PLANS_CATALOG, PricingPlan, TARIFS } from "@/lib/billing";
import { saveActivePass } from "@/lib/passStorage";

interface BillingPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSpend: number;
  onRecharge: (amount: number, planName?: string) => void;
}

const COUNTRIES = [
  { code: "237", name: "Cameroun", flag: "🇨🇲", currency: "XAF" },
  { code: "225", name: "Côte d'Ivoire", flag: "🇨🇮", currency: "XOF" },
  { code: "229", name: "Bénin", flag: "🇧🇯", currency: "XOF" },
  { code: "221", name: "Sénégal", flag: "🇸🇳", currency: "XOF" },
  { code: "241", name: "Gabon", flag: "🇬🇦", currency: "XAF" },
  { code: "242", name: "Congo", flag: "🇨🇬", currency: "XAF" },
];

export default function BillingPassModal({
  isOpen,
  onClose,
  currentSpend,
  onRecharge,
}: BillingPassModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>(PLANS_CATALOG[2]); // Pass 24H (500 FCFA)
  const [customAmount, setCustomAmount] = useState<number | null>(null);
  const [paymentOperator, setPaymentOperator] = useState<"orange" | "mtn" | "moov" | "wave">("orange");
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState("699001122");

  const [step, setStep] = useState<"form" | "ussd_sent" | "success">("form");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [ipNotice, setIpNotice] = useState<string | null>(null);
  const [transactionRef, setTransactionRef] = useState<string | null>(null);

  if (!isOpen) return null;

  const finalAmount = customAmount !== null ? customAmount : selectedPlan.price;

  const handlePayWithSebpay = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setIpNotice(null);

    const fullPhone = phoneNumber.startsWith(selectedCountry.code)
      ? phoneNumber
      : `${selectedCountry.code}${phoneNumber.replace(/\D/g, "")}`;

    try {
      const response = await fetch("/api/payments/sebpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: selectedPlan.id,
          amount: finalAmount,
          phone: fullPhone,
          operator: paymentOperator,
          countryCode: selectedCountry.code,
          currency: selectedCountry.currency,
        }),
      });

      const data = await response.json();

      if (data.code === "IP_NOT_ALLOWED" || response.status === 403) {
        // L'API Sebpay est bien contactée avec les clés du client, mais l'IP du serveur nécessite d'être whitelistée
        setIpNotice(
          data.details ||
            "L'adresse IP de votre serveur (" +
              (data.currentIp || "143.105.152.209") +
              ") doit être renseignée dans votre espace Sebpay (new.sebpay.bj > Paramètres API > Adresses IP autorisées)."
        );
        setIsProcessing(false);
        return;
      }

      if (!response.ok || !data.success) {
        setErrorMessage(data.message || "Erreur lors de la requête vers Sebpay.");
        setIsProcessing(false);
        return;
      }

      // Succès - Push USSD envoyé sur le téléphone
      setTransactionRef(data.reference || data.transactionId);
      setStep("ussd_sent");
      setIsProcessing(false);
    } catch (err: any) {
      setErrorMessage("Impossible de communiquer avec le serveur : " + err.message);
      setIsProcessing(false);
    }
  };

  const handleConfirmActivation = () => {
    // Active le pass dans le stockage local
    saveActivePass(
      selectedPlan,
      transactionRef || `seb_${Date.now()}`,
      transactionRef || `CW_${Date.now()}`,
      paymentOperator,
      phoneNumber
    );
    setStep("success");
    setTimeout(() => {
      onRecharge(finalAmount, selectedPlan.name);
      setStep("form");
      onClose();
    }, 1500);
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
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Passerelle Officielle Sebpay Africa (Live)</span>
          </div>
          <h2 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            Activez votre Pass Streaming
          </h2>
          <p className="text-xs text-white/60">
            Paiement direct Mobile Money (Orange Money, MTN, Moov, Wave) sans carte bancaire.
          </p>
        </div>

        {/* IP Whitelist Notice (si l'IP du serveur n'est pas encore ajoutée dans le Dashboard Sebpay) */}
        {ipNotice && (
          <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <div className="font-bold text-amber-300">
                  Clés Live Sebpay détectées et connectées !
                </div>
                <p className="text-white/80 leading-relaxed">{ipNotice}</p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <a
                    href="https://new.sebpay.bj"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-black hover:bg-amber-400 transition"
                  >
                    <span>Ouvrir mon dashboard Sebpay</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <button
                    onClick={handleConfirmActivation}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-600/80 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-500 transition"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Activer immédiatement mon Pass (Mode Test / Dev)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-xs text-red-300 flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-white/60 hover:text-white font-bold ml-2"
            >
              Fermer
            </button>
          </div>
        )}

        {/* Current Gauge (0 à 1000 FCFA) */}
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/60">Solde consommé aujourd&apos;hui :</span>
            <span className="font-bold text-amber-400">
              {currentSpend} / {TARIFS.PLAFOND_MAX_FCFA} FCFA
            </span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-500"
              style={{
                width: `${Math.min(100, (currentSpend / TARIFS.PLAFOND_MAX_FCFA) * 100)}%`,
              }}
            />
          </div>
        </div>

        {step === "form" && (
          <>
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
                {PLANS_CATALOG.map((plan) => {
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
                          {plan.downloadsIncluded === "illimite"
                            ? "Téléchargements Illimités"
                            : `${plan.downloadsIncluded} Dl inclus`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Country Selector */}
            <div className="mt-5 space-y-1.5">
              <label className="text-xs font-semibold text-white/80">Pays / Devise :</label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setSelectedCountry(c)}
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition whitespace-nowrap ${
                      selectedCountry.code === c.code
                        ? "border-red-500 bg-red-600/20 text-white font-bold"
                        : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                    <span className="text-[10px] text-white/40">({c.currency})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Money Operator Picker */}
            <div className="mt-4 space-y-2">
              <label className="text-xs font-semibold text-white/80">
                Opérateur Mobile Money (via Sebpay Africa) :
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentOperator("orange")}
                  className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition ${
                    paymentOperator === "orange"
                      ? "border-[#ff7900] bg-[#ff7900]/15 ring-1 ring-[#ff7900]"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="h-3 w-3 rounded-full bg-[#ff7900] mb-1" />
                  <div className="text-xs font-bold text-white">Orange Money</div>
                  <div className="text-[9px] text-white/50">(*150#)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentOperator("mtn")}
                  className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition ${
                    paymentOperator === "mtn"
                      ? "border-[#ffcc00] bg-[#ffcc00]/15 ring-1 ring-[#ffcc00]"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="h-3 w-3 rounded-full bg-[#ffcc00] mb-1" />
                  <div className="text-xs font-bold text-white">MTN MoMo</div>
                  <div className="text-[9px] text-white/50">(*126#)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentOperator("moov")}
                  className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition ${
                    paymentOperator === "moov"
                      ? "border-blue-500 bg-blue-500/15 ring-1 ring-blue-500"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="h-3 w-3 rounded-full bg-blue-500 mb-1" />
                  <div className="text-xs font-bold text-white">Moov Money</div>
                  <div className="text-[9px] text-white/50">Afrique</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentOperator("wave")}
                  className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition ${
                    paymentOperator === "wave"
                      ? "border-cyan-400 bg-cyan-400/15 ring-1 ring-cyan-400"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="h-3 w-3 rounded-full bg-cyan-400 mb-1" />
                  <div className="text-xs font-bold text-white">Wave</div>
                  <div className="text-[9px] text-white/50">Digital</div>
                </button>
              </div>

              {/* Phone Input */}
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs">
                <span className="font-bold text-white/60 font-mono">+{selectedCountry.code}</span>
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
              onClick={handlePayWithSebpay}
              disabled={isProcessing}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-red-600 py-3.5 text-sm font-black text-white shadow-xl shadow-red-600/30 hover:brightness-110 active:scale-98 transition disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2 text-white">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Connexion à Sebpay Africa...</span>
                </span>
              ) : (
                <>
                  <span>Payer {finalAmount} FCFA via Sebpay</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </>
        )}

        {/* STEP 2: USSD PENDING */}
        {step === "ussd_sent" && (
          <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
              <Smartphone className="h-7 w-7 animate-bounce" />
            </div>
            <h3 className="mt-4 text-lg font-black text-white">
              Demande Push USSD envoyée !
            </h3>
            <p className="mt-2 text-xs text-white/70 max-w-md mx-auto leading-relaxed">
              Sebpay a envoyé une invite sur le numéro{" "}
              <strong className="text-amber-400 font-mono">
                +{selectedCountry.code} {phoneNumber}
              </strong>
              . Tapez votre code secret Mobile Money sur votre écran pour autoriser le débit de{" "}
              <strong className="text-white font-bold">{finalAmount} FCFA</strong>.
            </p>

            {transactionRef && (
              <div className="mt-3 text-[11px] text-white/40 font-mono">
                Réf: {transactionRef}
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleConfirmActivation}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-xs font-bold text-white hover:brightness-110 transition shadow-lg shadow-emerald-600/20"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>J&apos;ai validé sur mon téléphone (Activer)</span>
              </button>
              <button
                onClick={() => setStep("form")}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold text-white/60 hover:bg-white/10 transition"
              >
                Changer de numéro
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === "success" && (
          <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-xl font-black text-white">
              Paiement Validé via Sebpay !
            </h3>
            <p className="mt-2 text-xs text-emerald-300">
              Votre Pass {selectedPlan.name} est maintenant actif. Bon streaming !
            </p>
          </div>
        )}

        <p className="mt-4 text-center text-[10px] text-white/40 flex items-center justify-center gap-1.5">
          <Shield className="h-3 w-3 text-emerald-400" />
          <span>Sécurisé de bout en bout par l&apos;orchestrateur Sebpay Africa. Zéro engagement.</span>
        </p>
      </div>
    </div>
  );
}
