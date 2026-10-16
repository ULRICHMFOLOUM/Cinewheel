"use client";

import { useState, useEffect } from "react";
import { WorksWheel } from "@/components/ui/works-wheel";
import Navbar from "@/components/Navbar";
import FeaturedSection from "@/components/FeaturedSection";
import Footer from "@/components/Footer";
import VideoPlayerModal from "@/components/VideoPlayerModal";
import BillingPassModal from "@/components/BillingPassModal";
import GlassFolder, { FolderFile } from "@/components/ui/glass-folder-cards";
import GlassCard from "@/components/ui/glass-card";
import Hero from "@/components/ui/animated-shader-hero";
import { calculerCoutTelechargement, TARIFS } from "@/lib/billing";
import { MediaItem, SeasonFolder, Episode, getStoredCatalog } from "@/lib/catalog";
import { Folder, Sparkles, Play, ShieldCheck, Zap, ArrowRight, Layers } from "lucide-react";

export default function Home() {
  const [currentSpend, setCurrentSpend] = useState<number>(100); // 100 FCFA au départ
  const [catalog, setCatalog] = useState<MediaItem[]>([]);
  const [activeFilm, setActiveFilm] = useState<MediaItem | null>(null);
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);
  const [activeSeason, setActiveSeason] = useState<SeasonFolder | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Charger le catalogue et écouter les synchronisations de l'Admin
  useEffect(() => {
    const items = getStoredCatalog();
    setCatalog(items);

    const handleUpdate = () => {
      setCatalog(getStoredCatalog());
    };
    window.addEventListener("cinewheel_catalog_updated", handleUpdate);
    return () => window.removeEventListener("cinewheel_catalog_updated", handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleWatchFilm = (
    film: MediaItem,
    episode?: Episode,
    season?: SeasonFolder
  ) => {
    setActiveFilm(film);
    if (episode && season) {
      setActiveEpisode(episode);
      setActiveSeason(season);
    } else if (film.seasons && film.seasons.length > 0 && film.seasons[0].episodes.length > 0) {
      setActiveSeason(film.seasons[0]);
      setActiveEpisode(film.seasons[0].episodes[0]);
    } else {
      setActiveEpisode(null);
      setActiveSeason(null);
    }
    setIsPlayerOpen(true);
  };

  const handleDownloadFilm = (
    film: MediaItem,
    episode?: Episode,
    season?: SeasonFolder
  ) => {
    const { cout, gratuitParPlafond, nouveauCumul } = calculerCoutTelechargement(currentSpend);
    setCurrentSpend(nouveauCumul);

    const titleRef = episode ? `${film.title} (Ép. ${episode.number})` : film.title;

    if (gratuitParPlafond) {
      showToast(`Téléchargement de "${titleRef}" lancé ! 100% Inclus (Plafond 1000 FCFA atteint).`);
    } else {
      showToast(`Téléchargement de "${titleRef}" débité (${cout} FCFA). Nouveau solde consommé : ${nouveauCumul} FCFA.`);
    }
  };

  const handleRecharge = (amount: number) => {
    const nextTotal = Math.min(TARIFS.PLAFOND_MAX_FCFA, currentSpend + amount);
    setCurrentSpend(nextTotal);
    showToast(`Pass rechargé avec succès (+${amount} FCFA). Total : ${nextTotal} FCFA.`);
  };

  const wheelItems = catalog.length > 0 ? catalog : getStoredCatalog();
  const firstHeroItem = wheelItems[0] || null;

  // Filtrer les animes populaires avec saisons pour les dossiers 3D
  const animesWithSeasons = wheelItems.filter(
    (item) => item.category === "anime" && item.seasons && item.seasons.length > 0
  );

  return (
    <main className="relative min-h-screen text-foreground" style={{ background: "#080a0f" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl border border-red-500/40 bg-[#161a24] px-4 py-3 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar currentSpend={currentSpend} onOpenBilling={() => setIsBillingOpen(true)} />

      {/* ── 1. Animated Shader Hero (WebGL interactive background) ── */}
      <section id="hero" className="relative w-full">
        <Hero
          trustBadge={{
            text: "N°1 Streaming Afrique Centrale • 100 FCFA / Heure • Max 1000 FCFA",
            icons: ["⚡", "🔥", "✨"],
          }}
          headline={{
            line1: "KAIJU STREAM",
            line2: "CINÉMA & ANIMES 3D",
          }}
          subtitle="Explorez vos animes préférés classés par dossiers de saisons et découvrez les plus grands blockbusters réels en haute définition. Décompte éco-data uniquement pendant la lecture."
          buttons={{
            primary: {
              text: firstHeroItem
                ? `Lancer ${firstHeroItem.title.split(":")[0]}`
                : "Explorer le Catalogue",
              onClick: () => {
                if (firstHeroItem) handleWatchFilm(firstHeroItem);
                else window.location.href = "/explorer";
              },
            },
            secondary: {
              text: "Simuler mon Tarif Fapshi",
              onClick: () => setIsBillingOpen(true),
            },
          }}
          className="pt-16 pb-12"
        />
      </section>

      {/* ── 2. Roue Cinématique 3D (WorksWheel) ── */}
      <section id="wheel" className="relative py-12 border-t border-white/5 bg-[#05070c]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span>Sélection Interactive 3D</span>
              </div>
              <h2
                className="mt-1 text-2xl sm:text-4xl font-extrabold italic text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                La Roue des Affiches & Titres
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-white/50">
                Faites tourner la roue pour explorer les animes et films réels du moment.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1">
                {wheelItems.length} titres disponibles
              </span>
            </div>
          </div>
        </div>

        {/* WorksWheel 3D component with real poster images */}
        <div className="relative h-[650px] sm:h-[720px] w-full overflow-hidden">
          {wheelItems.length > 0 && (
            <WorksWheel
              items={wheelItems}
              label="KAIJU STREAM"
              action="Visionner"
              className="!bg-transparent"
            />
          )}
        </div>
      </section>

      {/* ── 3. SECTION VEDETTE : DOSSIERS DE SAISONS 3D (GlassFolder Cards) ── */}
      <section className="relative z-10 px-4 sm:px-6 py-20 border-t border-b border-white/5 bg-[#06080d]">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                <Folder className="h-4 w-4" />
                <span>Nouveauté • Dossiers de Saisons Interactifs 3D</span>
              </div>
              <h2
                className="mt-2 text-3xl font-extrabold italic text-white md:text-5xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Dossiers Saisons Animes en Verre Dépoli
              </h2>
              <p className="mt-2 text-sm text-white/50 max-w-2xl">
                Survolez un dossier pour incliner la vitre, cliquez pour l'ouvrir et déployer les épisodes. Cliquez sur un épisode pour lancer la lecture directe !
              </p>
            </div>

            <a
              href="/explorer"
              className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition"
            >
              <span>Voir tous les dossiers de saisons</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Grid of GlassFolder Cards representing Anime Seasons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
            {animesWithSeasons.slice(0, 3).map((anime, idx) => {
              const mainSeason = anime.seasons![0];
              const folderFiles: FolderFile[] = mainSeason.episodes.map((ep) => ({
                name: `Ép. ${ep.number} : ${ep.title}`,
                meta: ep.duration,
                image: ep.thumbnail || anime.image,
              }));

              return (
                <div key={anime.id} className="flex flex-col items-center">
                  <GlassFolder
                    label={anime.title.split(":")[0]}
                    meta={`${mainSeason.folderName} (${mainSeason.episodes.length} ép.)`}
                    tone="dark"
                    image={anime.backdropUrl || anime.image}
                    files={folderFiles}
                    action="more"
                    width={330}
                    appearDelay={idx * 150}
                    menu={[
                      {
                        label: `Lire ${mainSeason.episodes[0]?.title || "Épisode 1"}`,
                        onSelect: () => handleWatchFilm(anime, mainSeason.episodes[0], mainSeason),
                      },
                      {
                        label: `Télécharger ${mainSeason.folderName}`,
                        onSelect: () => handleDownloadFilm(anime, mainSeason.episodes[0], mainSeason),
                      },
                      {
                        label: "Explorer toutes les saisons",
                        onSelect: () => handleWatchFilm(anime),
                      },
                    ]}
                    onFileSelect={(_, fileIndex) => {
                      const ep = mainSeason.episodes[fileIndex];
                      if (ep) {
                        handleWatchFilm(anime, ep, mainSeason);
                      }
                    }}
                  />

                  <div className="mt-4 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-950/40 border border-red-500/30 px-2 py-0.5 rounded-full">
                      {anime.genre}
                    </span>
                    <h4 className="mt-1.5 text-sm font-bold text-white">{anime.title}</h4>
                    <p className="text-xs text-white/40">
                      {anime.seasons!.length} dossiers de saisons disponibles
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Featured & Catalog Section (Films Réels, Séries & Animes) ── */}
      <FeaturedSection
        films={wheelItems}
        currentSpend={currentSpend}
        onWatch={handleWatchFilm}
        onDownload={handleDownloadFilm}
        onOpenBilling={() => setIsBillingOpen(true)}
      />

      {/* ── 5. SECTION 3D GLASS CARDS : AVANTAGES & FORMULES ── */}
      <section className="relative z-10 px-4 sm:px-6 py-20 bg-gradient-to-b from-[#080a0f] to-[#040508] border-t border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
              <Sparkles className="h-4 w-4" />
              <span>Technologie & Formules Uniques</span>
            </div>
            <h2
              className="mt-2 text-3xl font-extrabold italic text-white md:text-5xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              L&apos;Expérience KAIJU STREAM en 3D
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-white/50">
              Survolez les cartes 3D pour admirer l'effet de profondeur holographique et découvrez les atouts de notre plateforme pour l'Afrique Centrale.
            </p>
          </div>

          {/* 3D GlassCard Showcase Grid */}
          <div className="flex flex-wrap items-center justify-center gap-10">
            <GlassCard
              title="100 FCFA / Heure"
              description="Streaming HLS ultra-économique. Le compteur ne tourne que lorsque vous regardez une vidéo."
              onViewMore={() => setIsBillingOpen(true)}
            />
            <GlassCard
              title="Plafond 1000F"
              description="Dès 1000 FCFA consommés dans le mois, tous les films et animes deviennent 100% gratuits et illimités."
              onViewMore={() => setIsBillingOpen(true)}
            />
            <GlassCard
              title="Orange & MTN"
              description="Paiements locaux et instantanés via Fapshi Mobile Money sans carte bancaire ni abonnement contraignant."
              onViewMore={() => setIsBillingOpen(true)}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Video Player Modal with Seasons Folders */}
      {activeFilm && (
        <VideoPlayerModal
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          title={activeFilm.title}
          genre={activeFilm.genre || "Action"}
          year={activeFilm.year || "2024"}
          image={activeEpisode?.thumbnail || activeFilm.image}
          videoUrl={activeEpisode?.videoUrl || activeFilm.videoUrl}
          currentSpend={currentSpend}
          seasons={activeFilm.seasons || []}
          currentEpisode={activeEpisode}
          currentSeason={activeSeason}
          onSelectEpisode={(ep, season) => {
            setActiveEpisode(ep);
            setActiveSeason(season);
          }}
          onDownload={() => handleDownloadFilm(activeFilm, activeEpisode || undefined, activeSeason || undefined)}
          onOpenBilling={() => {
            setIsPlayerOpen(false);
            setIsBillingOpen(true);
          }}
        />
      )}

      {/* Billing & Fapshi Pass Modal */}
      <BillingPassModal
        isOpen={isBillingOpen}
        onClose={() => setIsBillingOpen(false)}
        currentSpend={currentSpend}
        onRecharge={handleRecharge}
      />
    </main>
  );
}
