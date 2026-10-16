"use client";

import { useState } from "react";
import {
  Folder,
  Play,
  Download,
  Clock,
  Sparkles,
  Film,
  Layers,
  CheckCircle2,
  ChevronRight,
  FileVideo,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { MediaItem, SeasonFolder, Episode } from "@/lib/catalog";
import { TARIFS, calculerCoutTelechargement } from "@/lib/billing";
import GlassFolder, { FolderFile } from "@/components/ui/glass-folder-cards";

interface SeasonFolderExplorerProps {
  item: MediaItem;
  currentSpend: number;
  onPlayEpisode: (episode: Episode, season: SeasonFolder) => void;
  onDownloadEpisode: (episode: Episode, season: SeasonFolder) => void;
  onPlayFilm?: () => void;
  onDownloadFilm?: () => void;
}

export default function SeasonFolderExplorer({
  item,
  currentSpend,
  onPlayEpisode,
  onDownloadEpisode,
  onPlayFilm,
  onDownloadFilm,
}: SeasonFolderExplorerProps) {
  const seasons = item.seasons || [];
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(
    seasons.length > 0 ? seasons[0].id : ""
  );
  const [displayStyle, setDisplayStyle] = useState<"interactive-glass" | "list">("interactive-glass");

  const activeSeason = seasons.find((s) => s.id === selectedSeasonId) || seasons[0];
  const downloadCost = calculerCoutTelechargement(currentSpend);

  if (seasons.length === 0) {
    // Single Film or Title without seasons
    return (
      <div className="rounded-2xl border border-white/10 bg-[#0d1017] p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 text-red-500 text-xs font-bold uppercase tracking-wider">
          <Film className="h-4 w-4" />
          <span>Fiche Film Réel • Fichier Unique</span>
        </div>
        <h3 className="mt-2 text-2xl font-black text-white">{item.title}</h3>
        <p className="mt-2 text-sm text-white/60 leading-relaxed">{item.synopsis}</p>

        <div className="mt-6 flex flex-wrap gap-4">
          <button
            onClick={onPlayFilm}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-red-600/30 hover:brightness-110 transition active:scale-95"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>Lancer le Film ({item.duration})</span>
          </button>
          <button
            onClick={onDownloadFilm}
            className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition active:scale-95"
          >
            <Download className="h-4 w-4 text-amber-400" />
            <span>
              Télécharger ({downloadCost.gratuitParPlafond ? "Inclus" : `${downloadCost.cout} FCFA`})
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Dossiers / Saisons Tabs Header + View Toggle */}
      <div>
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-red-400">
            <Folder className="h-4 w-4" />
            <span>Dossiers de Saisons ({seasons.length} Dossiers Disponibles)</span>
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setDisplayStyle("interactive-glass")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                displayStyle === "interactive-glass"
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Dossiers 3D Glass</span>
            </button>
            <button
              onClick={() => setDisplayStyle("list")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                displayStyle === "list"
                  ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Grille Épisodes</span>
            </button>
          </div>
        </div>

        {/* 3D Glass Folder Cards View */}
        {displayStyle === "interactive-glass" ? (
          <div className="rounded-2xl border border-white/10 bg-[#07090e]/90 p-6 backdrop-blur-xl">
            <div className="mb-4 text-xs text-white/50 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span>Survolez un dossier pour l'incliner • Cliquez pour ouvrir et voir les épisodes fannés :</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 py-6">
              {seasons.map((season, idx) => {
                const folderFiles: FolderFile[] = season.episodes.map((ep) => ({
                  name: `Ép. ${ep.number} : ${ep.title}`,
                  meta: ep.duration,
                  image: ep.thumbnail || item.image,
                }));

                return (
                  <div key={season.id} className="flex flex-col items-center">
                    <GlassFolder
                      label={`Saison ${season.seasonNumber}`}
                      meta={`${season.episodes.length} épisodes • ${season.year || "2024"}`}
                      tone="dark"
                      image={season.episodes[0]?.thumbnail || item.backdropUrl || item.image}
                      files={folderFiles}
                      action="more"
                      menu={[
                        {
                          label: "Lancer la saison (Ép. 1)",
                          onSelect: () => {
                            if (season.episodes.length > 0) {
                              onPlayEpisode(season.episodes[0], season);
                            }
                          },
                        },
                        {
                          label: "Télécharger la saison complète",
                          onSelect: () => {
                            if (season.episodes.length > 0) {
                              onDownloadEpisode(season.episodes[0], season);
                            }
                          },
                        },
                      ]}
                      onFileSelect={(_, fileIdx) => {
                        const ep = season.episodes[fileIdx];
                        if (ep) {
                          onPlayEpisode(ep, season);
                        }
                      }}
                      width={310}
                      appearDelay={idx * 120}
                    />
                    <div className="mt-3 text-center">
                      <h4 className="text-xs font-bold text-white">{season.folderName}</h4>
                      <button
                        onClick={() => {
                          setSelectedSeasonId(season.id);
                          setDisplayStyle("list");
                        }}
                        className="mt-1 text-[11px] text-red-400 hover:text-red-300 font-semibold"
                      >
                        Voir la liste complète des épisodes →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Classic Folder Pills Selector */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {seasons.map((season) => {
              const isSelected = season.id === activeSeason?.id;
              return (
                <button
                  key={season.id}
                  onClick={() => setSelectedSeasonId(season.id)}
                  className={`group flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-300 ${
                    isSelected
                      ? "border-red-500/70 bg-gradient-to-r from-red-950/40 to-black/60 shadow-lg shadow-red-900/20 text-white"
                      : "border-white/10 bg-[#0f121a]/80 text-white/70 hover:border-white/25 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg transition ${
                        isSelected
                          ? "bg-red-600 text-white"
                          : "bg-white/10 text-white/60 group-hover:bg-white/15 group-hover:text-white"
                      }`}
                    >
                      <Folder className="h-5 w-5 fill-current" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition">
                        {season.folderName}
                      </h4>
                      <p className="text-[11px] text-white/50 mt-0.5">
                        {season.episodesCount} épisodes • {season.year || "2024"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 transition duration-300 ${
                      isSelected ? "text-red-400 translate-x-1" : "text-white/30"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Folder Content / Detailed Episodes List */}
      {activeSeason && displayStyle === "list" && (
        <div className="rounded-2xl border border-white/10 bg-[#0a0d14] p-5 shadow-2xl backdrop-blur-md">
          {/* Active Folder Info Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-5">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
                <Folder className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <span>Contenu du {activeSeason.folderName}</span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/70">
                    {activeSeason.episodes.length} épisodes prêts
                  </span>
                </h3>
                <p className="text-[11px] text-white/40">
                  Qualité adaptative HLS (360p - 1080p) • Streaming fluide et téléchargement à 50 FCFA
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (activeSeason.episodes.length > 0) {
                  onPlayEpisode(activeSeason.episodes[0], activeSeason);
                }
              }}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-red-600/30 hover:bg-red-500 transition active:scale-95"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              <span>Lancer le 1er Épisode</span>
            </button>
          </div>

          {/* Episode Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSeason.episodes.map((ep) => (
              <div
                key={ep.id}
                className="group relative flex gap-3 rounded-xl border border-white/10 bg-[#111420]/80 p-3 transition duration-300 hover:border-red-500/40 hover:bg-[#161a28]"
              >
                {/* Episode Thumbnail */}
                <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-lg bg-black/60">
                  <img
                    src={ep.thumbnail || item.image}
                    alt={ep.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition" />
                  <span className="absolute bottom-1 left-1 rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-bold text-white/90 backdrop-blur-sm">
                    {ep.duration}
                  </span>
                  <button
                    onClick={() => onPlayEpisode(ep, activeSeason)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
                      <Play className="h-4 w-4 fill-white ml-0.5" />
                    </span>
                  </button>
                </div>

                {/* Episode Details */}
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-red-400">Épisode {ep.number}</span>
                      <span className="text-[10px] text-white/40">• {ep.duration}</span>
                    </div>
                    <h5 className="mt-0.5 text-xs font-bold text-white truncate group-hover:text-red-300 transition">
                      {ep.title}
                    </h5>
                    {ep.synopsis && (
                      <p className="mt-1 line-clamp-2 text-[10px] text-white/50 leading-relaxed">
                        {ep.synopsis}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => onPlayEpisode(ep, activeSeason)}
                      className="flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-red-600 hover:text-white transition"
                    >
                      <Play className="h-2.5 w-2.5 fill-current" />
                      <span>Lire</span>
                    </button>
                    <button
                      onClick={() => onDownloadEpisode(ep, activeSeason)}
                      className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold text-white/70 hover:bg-white/10 hover:text-amber-400 transition"
                      title="Téléchargement direct"
                    >
                      <Download className="h-2.5 w-2.5 text-amber-400" />
                      <span>{downloadCost.gratuitParPlafond ? "Inclus" : "50 F"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
