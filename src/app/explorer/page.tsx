"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Play,
  Download,
  Star,
  Sparkles,
  ArrowLeft,
  Clock,
  Film,
  Tv,
  Compass,
  Folder,
  Layers,
  ChevronRight,
  SlidersHorizontal,
  FolderOpen,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoPlayerModal from "@/components/VideoPlayerModal";
import BillingPassModal from "@/components/BillingPassModal";
import SeasonFolderExplorer from "@/components/SeasonFolderExplorer";
import {
  MediaItem,
  SeasonFolder,
  Episode,
  getStoredCatalog,
  MediaCategory,
} from "@/lib/catalog";
import { calculerCoutTelechargement, TARIFS } from "@/lib/billing";

export default function ExplorerPage() {
  const [catalog, setCatalog] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "folders">("grid");
  const [currentSpend, setCurrentSpend] = useState(100);

  // Player & Episode selection state
  const [activeFilm, setActiveFilm] = useState<MediaItem | null>(null);
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);
  const [activeSeason, setActiveSeason] = useState<SeasonFolder | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Folder Explorer modal state
  const [folderInspectionItem, setFolderInspectionItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    setCatalog(getStoredCatalog());
    const handleUpdate = () => setCatalog(getStoredCatalog());
    window.addEventListener("cinewheel_catalog_updated", handleUpdate);
    return () => window.removeEventListener("cinewheel_catalog_updated", handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleWatch = (
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

  const handleDownload = (
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

  // Extraire les genres uniques pour les puces de filtrage
  const allGenres = Array.from(
    new Set(
      catalog.flatMap((item) =>
        item.genre.split("/").map((g) => g.trim())
      )
    )
  ).slice(0, 10);

  // Filtrage combiné par recherche, catégorie et genre
  const filtered = catalog.filter((item) => {
    const query = search.toLowerCase();
    const matchQuery =
      item.title.toLowerCase().includes(query) ||
      (item.genre && item.genre.toLowerCase().includes(query)) ||
      (item.synopsis && item.synopsis.toLowerCase().includes(query));

    const matchCat = category === "all" || item.category === category;
    const matchGenre =
      selectedGenre === "all" ||
      item.genre.toLowerCase().includes(selectedGenre.toLowerCase());

    return matchQuery && matchCat && matchGenre;
  });

  const downloadCost = calculerCoutTelechargement(currentSpend);

  return (
    <div className="min-h-screen bg-[#080a0f] text-foreground flex flex-col">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl border border-red-500/40 bg-[#161a24] px-4 py-3 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar currentSpend={currentSpend} onOpenBilling={() => setIsBillingOpen(true)} />

      <main className="flex-1 px-4 sm:px-6 py-12 max-w-7xl mx-auto w-full">
        {/* Header Title & Back */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/10">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white transition mb-3"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour à l'accueil</span>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-extrabold italic text-white flex items-center gap-3">
              <span>Explorateur & Dossiers Saisons</span>
              <span className="text-sm not-italic font-bold bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full">
                {filtered.length} titres
              </span>
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Classement par catégorie (Films réels, Animes, Séries) et navigation par dossiers de saisons.
            </p>
          </div>

          {/* Toggle Vue Grille / Vue Dossiers */}
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10 self-start md:self-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                viewMode === "grid"
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Film className="h-3.5 w-3.5" />
              <span>Vue Grille</span>
            </button>
            <button
              onClick={() => setViewMode("folders")}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                viewMode === "folders"
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Folder className="h-3.5 w-3.5 text-amber-400" />
              <span>Vue Dossiers Saisons</span>
            </button>
          </div>
        </div>

        {/* Search & Categories Bar */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input
                type="text"
                placeholder="Rechercher un anime (Solo Leveling, Jujutsu...), film réel (Dune, Oppenheimer) ou genre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-[#0e121b] text-sm text-white placeholder-white/40 focus:border-red-500 focus:outline-none transition"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "Tous", icon: Compass },
                { id: "anime", label: "⚔️ Animes & Isekai", icon: Sparkles },
                { id: "film", label: "🎬 Films Réels", icon: Film },
                { id: "serie", label: "📺 Séries", icon: Tv },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setCategory(id)}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold border transition ${
                    category === id
                      ? "bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Genre Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40 shrink-0">
              Genres :
            </span>
            <button
              onClick={() => setSelectedGenre("all")}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold shrink-0 transition ${
                selectedGenre === "all"
                  ? "bg-white/20 text-white font-bold"
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
              }`}
            >
              Tous
            </button>
            {allGenres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold shrink-0 transition ${
                  selectedGenre === g
                    ? "bg-red-600 text-white font-bold shadow"
                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Modal / Inspection for Active Folder */}
        {folderInspectionItem && (
          <div className="mt-8 rounded-2xl border border-red-500/40 bg-gradient-to-b from-[#101420] to-[#0a0d14] p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
                  <Folder className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <span>Dossiers de Saisons : {folderInspectionItem.title}</span>
                    <span className="rounded-full bg-red-600/30 text-red-300 px-2 py-0.5 text-[10px] font-bold border border-red-500/30">
                      {folderInspectionItem.category.toUpperCase()}
                    </span>
                  </h3>
                  <p className="text-xs text-white/50">
                    {folderInspectionItem.genre} • {folderInspectionItem.year}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFolderInspectionItem(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white transition"
              >
                Fermer ✕
              </button>
            </div>

            <SeasonFolderExplorer
              item={folderInspectionItem}
              currentSpend={currentSpend}
              onPlayEpisode={(ep, season) => handleWatch(folderInspectionItem, ep, season)}
              onDownloadEpisode={(ep, season) => handleDownload(folderInspectionItem, ep, season)}
              onPlayFilm={() => handleWatch(folderInspectionItem)}
              onDownloadFilm={() => handleDownload(folderInspectionItem)}
            />
          </div>
        )}

        {/* Mode Dossiers Saisons (Vue Directe par Dossiers pour les animes) */}
        {viewMode === "folders" ? (
          <div className="mt-10 space-y-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400">
              <FolderOpen className="h-4 w-4" />
              <span>Navigation Directe par Dossiers de Saisons</span>
            </div>

            {filtered.map((item) => {
              const seasons = item.seasons || [];
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-16 w-12 rounded-lg object-cover shadow-md border border-white/10"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                              item.category === "anime"
                                ? "bg-purple-900/60 text-purple-200 border border-purple-500/30"
                                : item.category === "film"
                                ? "bg-red-900/60 text-red-200 border border-red-500/30"
                                : "bg-blue-900/60 text-blue-200 border border-blue-500/30"
                            }`}
                          >
                            {item.category === "anime"
                              ? "⚔️ Anime"
                              : item.category === "film"
                              ? "🎬 Film"
                              : "📺 Série"}
                          </span>
                          <span className="text-xs text-white/40">{item.genre}</span>
                        </div>
                        <h3 className="text-lg font-black text-white mt-0.5">{item.title}</h3>
                        <p className="text-xs text-white/50">
                          {seasons.length > 0
                            ? `${seasons.length} Dossiers de saisons configurés`
                            : `Fichier unique (${item.duration})`}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleWatch(item)}
                      className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-500 transition self-start sm:self-auto"
                    >
                      <Play className="h-3.5 w-3.5 fill-white" />
                      <span>Lancer la lecture</span>
                    </button>
                  </div>

                  <SeasonFolderExplorer
                    item={item}
                    currentSpend={currentSpend}
                    onPlayEpisode={(ep, season) => handleWatch(item, ep, season)}
                    onDownloadEpisode={(ep, season) => handleDownload(item, ep, season)}
                    onPlayFilm={() => handleWatch(item)}
                    onDownloadFilm={() => handleDownload(item)}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          /* Mode Grille d'Affiches Classique */
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((film) => {
              const hasSeasons = film.seasons && film.seasons.length > 0;
              return (
                <div
                  key={film.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0f1118] transition duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-[0_20px_40px_-15px_rgba(220,38,38,0.25)]"
                >
                  {/* Poster Image */}
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-black/60">
                    <img
                      src={film.image}
                      alt={film.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1118] via-transparent to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute left-3 top-3 flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm border ${
                          film.category === "anime"
                            ? "bg-purple-900/80 text-purple-200 border-purple-500/40"
                            : film.category === "film"
                            ? "bg-red-900/80 text-red-200 border-red-500/40"
                            : "bg-blue-900/80 text-blue-200 border-blue-500/40"
                        }`}
                      >
                        {film.category === "anime"
                          ? "⚔️ Anime"
                          : film.category === "film"
                          ? "🎬 Film Réel"
                          : "📺 Série"}
                      </span>
                    </div>

                    {/* Rating & Seasons count */}
                    <div className="absolute right-3 top-3 flex items-center gap-1.5">
                      {hasSeasons && (
                        <span className="flex items-center gap-1 rounded-full bg-red-600/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
                          <Folder className="h-3 w-3 fill-white" />
                          <span>{film.seasons!.length} Saisons</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[11px] font-bold text-amber-400 backdrop-blur-sm border border-white/10">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {film.rating}
                      </span>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-white/50">
                        <span>{film.year}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {film.duration}
                        </span>
                      </div>
                      <h4 className="mt-1 text-sm font-bold text-white group-hover:text-red-400 transition truncate">
                        {film.title}
                      </h4>
                      <p className="mt-1 line-clamp-2 text-[11px] text-white/60 leading-relaxed">
                        {film.synopsis}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                      {hasSeasons && (
                        <button
                          onClick={() => setFolderInspectionItem(film)}
                          className="flex w-full items-center justify-center gap-1 rounded-xl border border-red-500/30 bg-red-600/10 py-1.5 text-[11px] font-bold text-red-300 hover:bg-red-600/25 transition"
                        >
                          <Folder className="h-3 w-3 text-red-400" />
                          <span>Ouvrir Dossiers ({film.seasons!.length})</span>
                        </button>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleWatch(film)}
                          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-red-600 py-2 text-xs font-bold text-white shadow-md shadow-red-600/30 hover:bg-red-500 transition active:scale-95"
                        >
                          <Play className="h-3 w-3 fill-white" />
                          <span>Visionner</span>
                        </button>
                        <button
                          onClick={() => handleDownload(film)}
                          className="flex items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-amber-400 transition"
                          title="Télécharger"
                        >
                          <Download className="h-3 w-3 text-amber-400" />
                          <span className="text-[10px] font-bold text-amber-400">
                            {downloadCost.gratuitParPlafond ? "Inclus" : "50F"}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="mt-16 flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-white/10 bg-white/5">
            <Film className="h-12 w-12 text-white/20 mb-3" />
            <h3 className="text-lg font-bold text-white">Aucun titre trouvé</h3>
            <p className="text-xs text-white/50 mt-1">
              Essayez une autre recherche ou filtrez par une catégorie différente.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("all");
                setSelectedGenre("all");
              }}
              className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </main>

      <Footer />

      {/* Video Player Modal with Season Folders Drawer */}
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
          onDownload={() =>
            handleDownload(activeFilm, activeEpisode || undefined, activeSeason || undefined)
          }
          onOpenBilling={() => {
            setIsPlayerOpen(false);
            setIsBillingOpen(true);
          }}
        />
      )}

      {/* Billing Modal */}
      <BillingPassModal
        isOpen={isBillingOpen}
        onClose={() => setIsBillingOpen(false)}
        currentSpend={currentSpend}
        onRecharge={(amt) => {
          setCurrentSpend((prev) => Math.min(TARIFS.PLAFOND_MAX_FCFA, prev + amt));
          showToast(`Pass rechargé (+${amt} FCFA).`);
        }}
      />
    </div>
  );
}
