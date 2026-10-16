"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, HardDrive, Play, Trash2, CheckCircle2, ShieldCheck, WifiOff, Folder } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoPlayerModal from "@/components/VideoPlayerModal";

interface DownloadedItem {
  id: string;
  title: string;
  image: string;
  size: string;
  date: string;
  genre: string;
  duration: string;
  category: "anime" | "film" | "serie";
}

const INITIAL_DOWNLOADS: DownloadedItem[] = [
  {
    id: "1",
    title: "Solo Leveling: Arise • Dossier Saison 1 (Ép. 1-3)",
    image: "https://image.tmdb.org/t/p/w500/geCRueV3ElhRTr0xtJuEWJt6dJ1.jpg",
    size: "240 Mo (Format Low Data)",
    date: "Aujourd'hui à 14:22",
    genre: "Isekai / Action",
    category: "anime",
    duration: "1h 12m",
  },
  {
    id: "2",
    title: "Dune: Deuxième Partie (Film Réel Complet)",
    image: "https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg",
    size: "620 Mo (Qualité 720p HLS)",
    date: "Hier à 21:05",
    genre: "Sci-Fi / Épique",
    category: "film",
    duration: "2h 46m",
  },
  {
    id: "3",
    title: "Jujutsu Kaisen • Dossier Saison 2 (Ép. 1-2)",
    image: "https://image.tmdb.org/t/p/w500/6qQzMJG27XOJsyAEEIisoJB45j2.jpg",
    size: "180 Mo (Éco Forfait)",
    date: "Il y a 3 jours",
    genre: "Shonen / Exorcisme",
    category: "anime",
    duration: "48m",
  },
];

export default function TelechargementsPage() {
  const [downloads, setDownloads] = useState<DownloadedItem[]>(INITIAL_DOWNLOADS);
  const [activeFilm, setActiveFilm] = useState<any>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const handleDelete = (id: string) => {
    setDownloads((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <main className="min-h-screen bg-[#080a0f] text-white">
      <Navbar currentSpend={250} onOpenBilling={() => {}} />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-28 pb-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-red-400 hover:text-red-300 mb-4 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Retour à l&apos;accueil</span>
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <WifiOff className="h-4 w-4" />
              <span>Mode Hors-Ligne PWA & Stockage Local</span>
            </div>
            <h1
              className="mt-2 text-3xl font-extrabold italic text-white md:text-5xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Mes Téléchargements
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Regardez vos animes et films à tout moment, sans consommer de données mobiles (50 FCFA / titre).
            </p>
          </div>

          {/* Storage Gauge */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 min-w-[260px]">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 text-white/60">
                <HardDrive className="h-3.5 w-3.5 text-amber-400" />
                <span>Espace utilisé :</span>
              </span>
              <span className="font-bold text-white">1.04 Go / 4.0 Go</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full bg-gradient-to-r from-red-600 to-amber-500 w-[26%]" />
            </div>
          </div>
        </div>

        {/* Downloads List */}
        <div className="mt-10 space-y-4">
          {downloads.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
              <Download className="mx-auto h-12 w-12 text-white/20" />
              <h3 className="mt-3 text-base font-bold text-white">Aucun fichier téléchargé</h3>
              <p className="mt-1 text-xs text-white/50">
                Explorez le catalogue et cliquez sur l'icône de téléchargement pour enregistrer vos épisodes.
              </p>
              <Link
                href="/explorer"
                className="mt-4 inline-block rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-red-500 transition"
              >
                Explorer le catalogue
              </Link>
            </div>
          ) : (
            downloads.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0d0f16] p-4 transition hover:border-red-500/40"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-20 w-14 rounded-xl object-cover border border-white/10 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                          item.category === "anime"
                            ? "bg-purple-900/60 text-purple-200 border border-purple-500/30"
                            : "bg-red-900/60 text-red-200 border border-red-500/30"
                        }`}
                      >
                        {item.category === "anime" ? "⚔️ Anime" : "🎬 Film Réel"}
                      </span>
                      <span className="text-xs text-white/40">{item.genre}</span>
                    </div>
                    <h4 className="mt-1 text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-white/50">
                      {item.duration} • <span className="text-emerald-400 font-semibold">{item.size}</span>
                    </p>
                    <span className="text-[10px] text-white/30">Enregistré : {item.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      setActiveFilm(item);
                      setIsPlayerOpen(true);
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-red-500 transition"
                  >
                    <Play className="h-3.5 w-3.5 fill-white" />
                    <span>Lire Hors-Ligne</span>
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/50 hover:bg-white/10 hover:text-red-400 transition"
                    title="Supprimer du stockage"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />

      {activeFilm && (
        <VideoPlayerModal
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          title={activeFilm.title}
          genre={activeFilm.genre}
          year="2024"
          image={activeFilm.image}
          currentSpend={1000}
          onDownload={() => {}}
        />
      )}
    </main>
  );
}
