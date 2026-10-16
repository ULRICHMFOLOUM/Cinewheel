"use client";

import { useState, useEffect } from "react";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Download,
  ShieldCheck,
  Clock,
  Sparkles,
  Share2,
  Wifi,
  Lock,
  Folder,
  Layers,
  ChevronRight,
  ListVideo,
} from "lucide-react";
import { TARIFS, calculerCoutTelechargement, estimerConsommationMegas } from "@/lib/billing";
import { SeasonFolder, Episode } from "@/lib/catalog";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  genre: string;
  year: string;
  image: string;
  videoUrl?: string;
  currentSpend: number;
  onDownload: () => void;
  onOpenBilling?: () => void;
  seasons?: SeasonFolder[];
  currentEpisode?: Episode | null;
  currentSeason?: SeasonFolder | null;
  onSelectEpisode?: (ep: Episode, season: SeasonFolder) => void;
}

export default function VideoPlayerModal({
  isOpen,
  onClose,
  title,
  genre,
  year,
  image,
  videoUrl,
  currentSpend,
  onDownload,
  onOpenBilling,
  seasons = [],
  currentEpisode,
  currentSeason,
  onSelectEpisode,
}: VideoPlayerModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [quality, setQuality] = useState<"360p" | "480p" | "720p" | "1080p">("480p");
  const [audioLang, setAudioLang] = useState("VF");
  const [showSettings, setShowSettings] = useState(false);
  const [showSeasonsDrawer, setShowSeasonsDrawer] = useState(false);
  const [activeSeasonId, setActiveSeasonId] = useState<string>(
    currentSeason?.id || (seasons.length > 0 ? seasons[0].id : "")
  );

  const [progressSec, setProgressSec] = useState(140);
  const totalDurationSec = 7200;
  const [trialSecondsLeft, setTrialSecondsLeft] = useState(TARIFS.ESSAI_GRATUIT_MINUTES * 60);
  const [trialExpired, setTrialExpired] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen && isPlaying && !trialExpired) {
      timer = setInterval(() => {
        setProgressSec((p) => Math.min(p + 1, totalDurationSec));
        setTrialSecondsLeft((p) => {
          if (p <= 1) {
            setTrialExpired(true);
            setIsPlaying(false);
            return 0;
          }
          return p - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, isPlaying, trialExpired]);

  useEffect(() => {
    if (currentSeason?.id) {
      setActiveSeasonId(currentSeason.id);
    }
  }, [currentSeason]);

  if (!isOpen) return null;

  const downloadCost = calculerCoutTelechargement(currentSpend);
  const estimatedMegas = estimerConsommationMegas(Math.floor(progressSec / 60) + 1, quality);
  const totalMegas = estimerConsommationMegas(120, quality);
  const fmtTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  const selectedSeason = seasons.find((s) => s.id === activeSeasonId) || seasons[0];

  const handleWhatsappShare = () => {
    const text = encodeURIComponent(
      `Je regarde "${title}" sur KAIJU STREAM ! Qualité fluide ${quality} (${totalMegas} Mo seulement). Essaie gratuitement → https://kaijustream.com`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
    setTrialSecondsLeft((p) => p + 3600);
    setTrialExpired(false);
  };

  const displayTitle = currentEpisode
    ? `${title} • Ép. ${currentEpisode.number} : ${currentEpisode.title}`
    : title;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 sm:p-5 backdrop-blur-2xl overflow-y-auto">
      <div className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c0e14] shadow-2xl my-auto max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 bg-[#0f121a]">
          <div className="flex items-center gap-3 min-w-0">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 flex-wrap truncate">
                <span className="truncate">{displayTitle}</span>
                <span className="rounded bg-red-600/20 px-1.5 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/30 shrink-0">
                  {audioLang}
                </span>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                  <Wifi className="h-2.5 w-2.5" />~{totalMegas} Mo
                </span>
                {!trialExpired && (
                  <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/30 flex items-center gap-1 shrink-0">
                    <Sparkles className="h-2.5 w-2.5" />Essai: {fmtTime(trialSecondsLeft)}
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-white/50 truncate">
                {genre} • {year} {currentSeason ? `• ${currentSeason.folderName}` : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {seasons.length > 0 && (
              <button
                onClick={() => setShowSeasonsDrawer(!showSeasonsDrawer)}
                className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-bold transition ${
                  showSeasonsDrawer
                    ? "bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30"
                    : "border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Folder className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">Dossiers Saisons</span>
                <span className="sm:hidden">Saisons</span>
              </button>
            )}

            <button
              onClick={onDownload}
              className="flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-[11px] font-medium text-white hover:bg-white/10 transition"
            >
              <Download className="h-3.5 w-3.5 text-amber-400" />
              <span>{downloadCost.gratuitParPlafond ? "Dl Inclus" : `Dl (${downloadCost.cout}F)`}</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Video Area + Seasons Drawer Overlay */}
        <div className="relative aspect-video w-full overflow-hidden bg-black group">
          <img
            src={currentEpisode?.thumbnail || image}
            alt={title}
            className="h-full w-full object-cover opacity-60 transition duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

          {/* Consommation Data Banner */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1 text-[11px] text-white/80 backdrop-blur-md border border-white/10">
            <Wifi className="h-3 w-3 text-emerald-400" />
            <span>
              Forfait data: <strong>~{estimatedMegas} Mo</strong> consommés sur ~{totalMegas} Mo total
            </span>
          </div>

          {trialExpired ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-6 text-center backdrop-blur-md z-20">
              <div className="rounded-full bg-red-600/20 p-4 border border-red-500/40 mb-3">
                <Lock className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg font-black text-white">Essai gratuit terminé !</h3>
              <p className="mt-1 max-w-sm text-xs text-white/60 leading-relaxed">
                Activez votre pass dès <strong className="text-amber-400">200 FCFA</strong> (Pass Flash) ou partagez sur WhatsApp pour gagner <strong>+1h gratuite</strong>.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={onOpenBilling}
                  className="rounded-xl bg-gradient-to-r from-red-600 to-amber-600 px-6 py-2.5 text-xs font-extrabold text-white shadow-xl hover:brightness-110 transition active:scale-95"
                >
                  Activer mon Pass (dès 200 FCFA)
                </button>
                <button
                  onClick={handleWhatsappShare}
                  className="flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 transition active:scale-95"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Partager (+1h Gratuite)</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600/90 p-5 text-white shadow-2xl transition hover:scale-110 hover:bg-red-500 z-10"
            >
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 fill-white ml-1" />}
            </button>
          )}

          {/* Sliding Season Folders Drawer */}
          {showSeasonsDrawer && seasons.length > 0 && (
            <div className="absolute inset-y-0 right-0 w-full sm:w-96 bg-[#0a0d14]/95 backdrop-blur-xl border-l border-white/10 z-20 flex flex-col p-4 shadow-2xl transition-all">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Folder className="h-4 w-4 text-red-500" />
                  <span>Dossiers de Saisons ({seasons.length})</span>
                </div>
                <button
                  onClick={() => setShowSeasonsDrawer(false)}
                  className="rounded p-1 text-white/50 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Season Folder Switcher */}
              <div className="flex gap-1.5 overflow-x-auto py-2.5 border-b border-white/10">
                {seasons.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSeasonId(s.id)}
                    className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                      s.id === selectedSeason?.id
                        ? "bg-red-600 text-white"
                        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Saison {s.seasonNumber}
                  </button>
                ))}
              </div>

              {/* Episodes in Active Folder */}
              <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1">
                {selectedSeason?.episodes.map((ep) => {
                  const isCurrent = currentEpisode?.id === ep.id;
                  return (
                    <button
                      key={ep.id}
                      onClick={() => {
                        if (onSelectEpisode && selectedSeason) {
                          onSelectEpisode(ep, selectedSeason);
                        }
                      }}
                      className={`w-full flex items-center gap-3 rounded-xl p-2 text-left transition border ${
                        isCurrent
                          ? "bg-red-600/20 border-red-500/60 text-white"
                          : "bg-white/5 border-transparent text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="relative aspect-video w-16 shrink-0 overflow-hidden rounded bg-black">
                        <img
                          src={ep.thumbnail || image}
                          alt={ep.title}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute bottom-0.5 right-0.5 rounded bg-black/80 px-1 text-[8px] font-bold text-white">
                          {ep.duration}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-red-400">Épisode {ep.number}</p>
                        <h5 className="text-xs font-semibold text-white truncate">{ep.title}</h5>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Controls Bar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-10">
            <div className="relative mb-3 h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-300"
                style={{ width: `${(progressSec / totalDurationSec) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-red-400">
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
                </button>
                <button onClick={() => setIsMuted(!isMuted)} className="hover:text-red-400">
                  {isMuted ? <VolumeX className="h-4 w-4 text-red-400" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <span className="font-mono text-white/70">
                  {fmtTime(progressSec)} / {fmtTime(totalDurationSec)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAudioLang(audioLang === "VF" ? "VOSTFR" : "VF")}
                  className="rounded border border-white/20 px-2 py-0.5 text-xs font-semibold hover:border-white transition"
                >
                  {audioLang}
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex items-center gap-1 hover:text-red-400 transition"
                  >
                    <Settings className="h-4 w-4" />
                    <span>{quality}</span>
                  </button>
                  {showSettings && (
                    <div className="absolute right-0 bottom-8 z-30 flex flex-col rounded-lg border border-white/10 bg-[#161922] p-2 text-xs shadow-xl min-w-[180px]">
                      <span className="px-2 py-1 text-[10px] uppercase text-white/40 font-bold">
                        Qualité — Éco Forfait
                      </span>
                      {[
                        ["360p", "~150 Mo / film"],
                        ["480p", "~300 Mo / film"],
                        ["720p", "~720 Mo / film"],
                        ["1080p", "~1.5 Go / film"],
                      ].map(([q, desc]) => (
                        <button
                          key={q}
                          onClick={() => {
                            setQuality(q as any);
                            setShowSettings(false);
                          }}
                          className={`rounded px-2 py-1 text-left hover:bg-white/10 transition ${
                            quality === q ? "text-red-400 font-bold" : "text-white/80"
                          }`}
                        >
                          {q} <span className="text-[10px] text-white/40">— {desc}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Maximize className="h-4 w-4 hover:text-red-400 cursor-pointer transition" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer: Security + WhatsApp Share */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#08090d] px-5 py-2.5 text-[11px] text-white/60 border-t border-white/5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Streaming HLS sécurisé Fapshi (Orange Money & MTN MoMo)</span>
          </div>
          <button
            onClick={handleWhatsappShare}
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Inviter sur WhatsApp (+1h Offerte)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
