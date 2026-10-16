import { Film, Shield, Smartphone, Heart } from "lucide-react";

const FOOTER_LINKS = [
  { section: "Catalogue", links: ["Isekai & Animes", "Films Box-Office", "Séries Africaines & Mondiales", "Top 10 Semaine"] },
  { section: "Tarification", links: ["Pass 100 FCFA / Heure", "Téléchargement 50 FCFA", "Garantie Plafond 1000 FCFA", "Fapshi Mobile Money"] },
  { section: "Support & Légal", links: ["Signalement de contenu", "Conditions Générales (CGU)", "Confidentialité", "Mode Hors-ligne PWA"] },
];

export default function Footer() {
  return (
    <footer
      className="border-t px-6 pt-16 pb-8"
      style={{ borderColor: "rgba(255,255,255,0.06)", background: "#050709" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 to-amber-500">
                <Film className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-black text-white">
                KAIJU<span className="text-red-500">STREAM</span>
              </span>
            </div>
            <p className="max-w-[260px] text-xs leading-relaxed text-white/40">
              La plateforme PWA de streaming & téléchargement pour le Cameroun et l&apos;Afrique centrale. Décompte équitable en lecture active via Orange Money & MTN MoMo.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-emerald-400">
              <Shield className="h-3.5 w-3.5" />
              <span>Paiement sécurisé Fapshi Cameroun</span>
            </div>
          </div>

          {/* Link groups */}
          {FOOTER_LINKS.map(({ section, links }) => (
            <div key={section}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/70">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs text-white/40 transition-colors duration-150 hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col items-center justify-between gap-3 border-t pt-6 text-center md:flex-row"
          style={{ borderColor: "rgba(255,255,255,0.04)" }}
        >
          <p className="text-xs text-white/30">
            © 2026 KAIJU STREAM — CinéWheel PWA Edition. Développé pour connexions optimisées.
          </p>
          <div className="flex items-center gap-2 text-xs text-white/30">
            <span>Fait avec passion pour l&apos;Afrique centrale</span>
            <span className="text-red-500">♥</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
