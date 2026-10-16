"use client";

import { useState, useEffect } from "react";
import { Film, Play, Download, Sparkles, Smartphone, CreditCard } from "lucide-react";

interface NavbarProps {
  currentSpend: number;
  onOpenBilling: () => void;
}

export default function Navbar({ currentSpend, onOpenBilling }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });

    // PWA beforeinstallprompt handler
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setCanInstall(false);
      }
      setDeferredPrompt(null);
    } else {
      alert("Pour installer l'application sur iOS : appuyez sur Partager puis 'Sur l'écran d'accueil'.");
    }
  };

  return (
    <nav
      className="fixed left-0 right-0 top-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(8,10,15,0.92)" : "rgba(8,10,15,0.5)",
        backdropFilter: "blur(20px)",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.03)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <a href="#" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.7)]">
            <Film className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1">
              KAIJU<span className="text-red-500">STREAM</span>
              <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-bold text-amber-400 border border-amber-500/30">
                AFRIQUE
              </span>
            </span>
            <p className="text-[10px] text-white/40 leading-none">CinéWheel 3D Edition</p>
          </div>
        </a>

        {/* Nav links */}
        <div className="hidden items-center gap-6 lg:flex">
          {[
            { label: "Roue 3D", href: "/#wheel" },
            { label: "Explorer (Catalogue)", href: "/explorer" },
            { label: "Tarifs (100F)", href: "/tarifs" },
            { label: "Téléchargements", href: "/telechargements" },
            { label: "Admin ⚙️", href: "/admin" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className={`text-xs font-semibold transition-colors duration-200 ${
                label.includes("Admin")
                  ? "text-red-400 hover:text-red-300 border border-red-500/30 bg-red-950/30 px-2.5 py-1 rounded-lg"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {label}
            </a>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* PWA Install Button */}
          <button
            onClick={handleInstallClick}
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/90 hover:bg-white/10 transition"
          >
            <Smartphone className="h-3.5 w-3.5 text-amber-400" />
            <span>Installer l&apos;App</span>
          </button>

          {/* Pass Balance / Billing Button */}
          <button
            onClick={onOpenBilling}
            className="flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/40 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-900/60 hover:border-red-500"
          >
            <CreditCard className="h-3.5 w-3.5 text-red-400" />
            <span>{currentSpend} / 1000 F</span>
          </button>

          {/* CTA Explore */}
          <a
            href="#wheel"
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-red-600 to-amber-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg transition hover:brightness-110 active:scale-95"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Explorer</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
