"use client";

import { useState } from "react";
import {
  Star,
  Clock,
  Play,
  Download,
  Zap,
  Sparkles,
  Tv,
  Film,
  Compass,
  CheckCircle,
  Folder,
  Layers,
  ChevronRight,
  Flame,
} from "lucide-react";
import { MediaItem, SeasonFolder, Episode } from "@/lib/catalog";
import { TARIFS, calculerCoutTelechargement } from "@/lib/billing";
import SeasonFolderExplorer from "@/components/SeasonFolderExplorer";

export type ExtendedFilmItem = MediaItem;

interface FeaturedSectionProps {
  films: MediaItem[];
  currentSpend: number;
  onWatch: (film: MediaItem, episode?: Episode, season?: SeasonFolder) => void;
  onDownload: (film: MediaItem, episode?: Episode, season?: SeasonFolder) => void;
  onOpenBilling: () => void;
}

export default function FeaturedSection({
  films,
  currentSpend,
  onWatch,
  onDownload,
  onOpenBilling,
}: FeaturedSectionProps) {
  const [filter, setFilter] = useState<"all" | "anime" | "film" | "serie">("all");
  const [activeFolderItem, setActiveFolderItem] = useState<MediaItem | null>(null);

  const filteredFilms =
    filter === "all" ? films : films.filter((f) => f.category === filter);
  const downloadCost = calculerCoutTelechargement(currentSpend);

  return (
    <section id="films" className="relative z-10 px-4 sm:px-6 py-20" style={{ background: "#080a0f" }}>
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
              <Sparkles className="h-4 w-4" />
              <span>Catalogue Officiel Films Réels & Animes Classés</span>
            </div>
            <h2
              className="mt-2 text-3xl font-bold italic text-white md:text-5xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Films Réels, Séries & Animes par Dossiers
            </h2>
            <p className="mt-2 text-sm text-white/50 max-w-2xl">
              Streaming HLS haute définition et éco-data • Organisation en dossiers par saisons • Téléchargement direct 50 FCFA
            </p>
          </div>

          {/* Filter Tabs by Category */}
          <div className="flex flex-wrap gap-2 rounded-xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-md">
            {[
              { id: "all", label: "Tous les Titres", icon: Compass },
              { id: "anime", label: "⚔️ Animes & Isekai", icon: Sparkles },
              { id: "film", label: "🎬 Films Réels", icon: Film },
              { id: "serie", label: "📺 Séries", icon: Tv },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setFilter(id as any)}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                  filter === id
                    ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Modal / Overlay for Season Folder Inspection if clicked */}
        {activeFolderItem && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-gradient-to-b from-[#101420] to-[#0a0d14] p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
                  <Folder className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <span>Exploration des Dossiers : {activeFolderItem.title}</span>
                    <span className="rounded-full bg-red-600/30 text-red-300 px-2 py-0.5 text-[10px] font-bold border border-red-500/30">
                      {activeFolderItem.category === "anime" ? "Anime" : activeFolderItem.category}
                    </span>
                  </h3>
                  <p className="text-xs text-white/50">{activeFolderItem.genre} • {activeFolderItem.year}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveFolderItem(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white transition"
              >
                Fermer l'explorateur ✕
              </button>
            </div>

            <SeasonFolderExplorer
              item={activeFolderItem}
              currentSpend={currentSpend}
              onPlayEpisode={(ep, season) => onWatch(activeFolderItem, ep, season)}
              onDownloadEpisode={(ep, season) => onDownload(activeFolderItem, ep, season)}
              onPlayFilm={() => onWatch(activeFolderItem)}
              onDownloadFilm={() => onDownload(activeFolderItem)}
            />
          </div>
        )}

        {/* Film & Anime Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFilms.map((film) => {
            const hasSeasons = film.seasons && film.seasons.length > 0;
            return (
              <div
                key={film.id || film.title}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0f1118] transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-[0_20px_40px_-15px_rgba(220,38,38,0.25)]"
              >
                {/* Poster Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60">
                  <img
                    src={film.image}
                    alt={film.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1118] via-transparent to-transparent" />

                  {/* Category & Badge */}
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
                    <span className="rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] font-medium text-white/80 border border-white/15">
                      {film.genre.split("/")[0]}
                    </span>
                  </div>

                  {/* Rating & Folders indicator */}
                  <div className="absolute right-3 top-3 flex items-center gap-1.5">
                    {hasSeasons && (
                      <span className="flex items-center gap-1 rounded-full bg-red-600/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
                        <Folder className="h-3 w-3 fill-white" />
                        <span>{film.seasons!.length} Saisons</span>
                      </span>
                    )}
                    <span className="flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-0.5 text-[11px] font-bold text-amber-400 backdrop-blur-sm border border-white/10">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {film.rating}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <span>{film.year}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {film.duration}
                      </span>
                    </div>

                    <h3 className="mt-1.5 text-lg font-bold text-white group-hover:text-red-400 transition">
                      {film.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-xs text-white/60 leading-relaxed">
                      {film.synopsis}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-5 flex flex-col gap-2">
                    {hasSeasons && (
                      <button
                        onClick={() => setActiveFolderItem(film)}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-500/40 bg-red-600/15 py-2 text-xs font-bold text-red-300 hover:bg-red-600/30 transition"
                      >
                        <Folder className="h-3.5 w-3.5 text-red-400" />
                        <span>Ouvrir les Dossiers Saisons ({film.seasons!.length})</span>
                      </button>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onWatch(film)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500 active:scale-95"
                      >
                        <Play className="h-3.5 w-3.5 fill-white" />
                        <span>{hasSeasons ? "Regarder Ép. 1" : "Regarder"}</span>
                      </button>

                      <button
                        onClick={() => onDownload(film)}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs font-semibold text-white/80 transition hover:bg-white/10 hover:text-white hover:border-amber-500/40"
                        title={
                          downloadCost.gratuitParPlafond
                            ? "Téléchargement inclus dans votre pass (Plafond 1000F)"
                            : `Téléchargement direct (${downloadCost.cout} FCFA)`
                        }
                      >
                        <Download className="h-3.5 w-3.5 text-amber-400" />
                        <span className="text-[11px] font-bold text-amber-400">
                          {downloadCost.gratuitParPlafond ? "Inclus" : `${downloadCost.cout}F`}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
