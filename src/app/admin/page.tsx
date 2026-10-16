"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Film,
  Plus,
  Trash2,
  Edit3,
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  Layers,
  DollarSign,
  TrendingUp,
  Users,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  Eye,
  Settings,
  ArrowLeft,
  Search,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Save,
  X,
  Folder,
  RotateCcw,
  Tag,
  Check,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  MediaItem,
  SeasonFolder,
  Episode,
  getStoredCatalog,
  saveMediaItem,
  deleteMediaItem,
  resetCatalogToDefault,
  PRESET_ARTWORK,
  MediaCategory,
} from "@/lib/catalog";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"catalog" | "seasons" | "stats" | "fapshi" | "tarifs">("catalog");
  const [catalog, setCatalog] = useState<MediaItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<"all" | "anime" | "film" | "serie">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Saisons & Épisodes
  const [selectedItemForSeasons, setSelectedItemForSeasons] = useState<MediaItem | null>(null);
  const [targetSeasonId, setTargetSeasonId] = useState<string>("");

  // Modal State for New/Edit Item
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MediaItem>>({
    category: "anime",
    title: "",
    genre: "Isekai / Action",
    year: "2024",
    rating: "9.0",
    duration: "Saison 1 • 12 ép.",
    synopsis: "",
    image: PRESET_ARTWORK[0].poster,
    backdropUrl: PRESET_ARTWORK[0].backdrop,
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    license: "Licence Certifiée Crunchyroll / A-1 Pictures",
    seasons: [],
  });

  // Modal State for New Season Folder
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newSeasonNumber, setNewSeasonNumber] = useState(1);
  const [newSeasonYear, setNewSeasonYear] = useState("2024");

  // Modal State for New Episode
  const [isEpisodeModalOpen, setIsEpisodeModalOpen] = useState(false);
  const [newEpisode, setNewEpisode] = useState<Partial<Episode>>({
    number: 1,
    title: "",
    duration: "24m",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnail: PRESET_ARTWORK[0].poster,
    synopsis: "",
  });

  const posterFileRef = useRef<HTMLInputElement>(null);
  const backdropFileRef = useRef<HTMLInputElement>(null);
  const videoFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const items = getStoredCatalog();
    setCatalog(items);
    if (items.length > 0) {
      // Prioritize an anime for the seasons tab
      const animeItem = items.find((i) => i.category === "anime") || items[0];
      setSelectedItemForSeasons(animeItem);
      if (animeItem.seasons && animeItem.seasons.length > 0) {
        setTargetSeasonId(animeItem.seasons[0].id);
      }
    }
  }, []);

  // File Upload Handlers with FileReader DataURL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: "image" | "backdropUrl" | "videoUrl") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditingItem((prev) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Enregistrer ou Mettre à jour un film / anime
  const handleSaveItem = () => {
    if (!editingItem.title) {
      alert("Veuillez saisir au moins le titre.");
      return;
    }

    const itemToSave: MediaItem = {
      id: editingItem.id || `item-${Date.now()}`,
      title: editingItem.title || "Sans Titre",
      category: editingItem.category || "anime",
      genre: editingItem.genre || "Action",
      year: editingItem.year || "2024",
      rating: editingItem.rating || "9.0",
      duration: editingItem.duration || (editingItem.category === "anime" ? "Saison 1 • 12 ép." : "2h 00m"),
      synopsis: editingItem.synopsis || "Description non communiquée.",
      image: editingItem.image || PRESET_ARTWORK[0].poster,
      backdropUrl: editingItem.backdropUrl || PRESET_ARTWORK[0].backdrop,
      videoUrl: editingItem.videoUrl || "",
      license: editingItem.license || "Licence standard",
      seasons: editingItem.seasons || [],
      isUploaded: true,
    };

    const updated = saveMediaItem(itemToSave);
    setCatalog(updated);
    if (selectedItemForSeasons?.id === itemToSave.id) {
      setSelectedItemForSeasons(itemToSave);
    }
    setIsModalOpen(false);
  };

  // Supprimer un élément
  const handleDeleteItem = (id: string) => {
    if (confirm("Supprimer définitivement ce titre du catalogue ?")) {
      const updated = deleteMediaItem(id);
      setCatalog(updated);
      if (selectedItemForSeasons?.id === id && updated.length > 0) {
        setSelectedItemForSeasons(updated[0]);
      }
    }
  };

  // Réinitialiser au catalogue d'origine (17 titres authentiques)
  const handleResetCatalog = () => {
    if (confirm("Réinitialiser le catalogue avec les 17 titres officiels et affiches réelles ?")) {
      const reset = resetCatalogToDefault();
      setCatalog(reset);
      setSelectedItemForSeasons(reset[0]);
    }
  };

  // Ajouter un nouveau Dossier Saison pour l'anime sélectionné
  const handleCreateSeasonFolder = () => {
    if (!selectedItemForSeasons) return;
    const folderName = newFolderName.trim() || `📁 Dossier Saison ${newSeasonNumber} : Nouvelle Saison`;
    const newSeason: SeasonFolder = {
      id: `season-${Date.now()}`,
      seasonNumber: newSeasonNumber,
      folderName: folderName,
      year: newSeasonYear,
      episodesCount: 1,
      episodes: [
        {
          id: `ep-${Date.now()}-1`,
          number: 1,
          title: "Épisode 1 : Le Début",
          duration: "24m",
          videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          thumbnail: selectedItemForSeasons.image,
          synopsis: "Début de la nouvelle saison.",
        },
      ],
    };

    const updatedSeasons = [...(selectedItemForSeasons.seasons || []), newSeason];
    const updatedItem: MediaItem = {
      ...selectedItemForSeasons,
      seasons: updatedSeasons,
      duration: `${updatedSeasons.length} Saisons`,
    };

    const updatedCatalog = saveMediaItem(updatedItem);
    setCatalog(updatedCatalog);
    setSelectedItemForSeasons(updatedItem);
    setTargetSeasonId(newSeason.id);
    setIsFolderModalOpen(false);
    setNewFolderName("");
  };

  // Supprimer un Dossier Saison
  const handleDeleteSeasonFolder = (seasonId: string) => {
    if (!selectedItemForSeasons) return;
    if (confirm("Supprimer ce dossier de saison et tous ses épisodes ?")) {
      const updatedSeasons = (selectedItemForSeasons.seasons || []).filter((s) => s.id !== seasonId);
      const updatedItem: MediaItem = {
        ...selectedItemForSeasons,
        seasons: updatedSeasons,
        duration: updatedSeasons.length > 0 ? `${updatedSeasons.length} Saisons` : selectedItemForSeasons.duration,
      };
      const updatedCatalog = saveMediaItem(updatedItem);
      setCatalog(updatedCatalog);
      setSelectedItemForSeasons(updatedItem);
      if (updatedSeasons.length > 0) {
        setTargetSeasonId(updatedSeasons[0].id);
      }
    }
  };

  // Ajouter un épisode dans un Dossier Saison
  const handleAddEpisodeToFolder = () => {
    if (!selectedItemForSeasons) return;
    if (!newEpisode.title) {
      alert("Veuillez indiquer un titre d'épisode.");
      return;
    }

    const folderId = targetSeasonId || selectedItemForSeasons.seasons?.[0]?.id;
    if (!folderId) {
      alert("Veuillez d'abord créer un dossier de saison.");
      return;
    }

    const ep: Episode = {
      id: `ep-${Date.now()}`,
      number: newEpisode.number || 1,
      title: newEpisode.title || "Épisode",
      duration: newEpisode.duration || "24m",
      videoUrl: newEpisode.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnail: newEpisode.thumbnail || selectedItemForSeasons.image,
      synopsis: newEpisode.synopsis || "",
    };

    const updatedSeasons = (selectedItemForSeasons.seasons || []).map((s) => {
      if (s.id === folderId) {
        const nextEpisodes = [...s.episodes, ep];
        return {
          ...s,
          episodesCount: nextEpisodes.length,
          episodes: nextEpisodes,
        };
      }
      return s;
    });

    const updatedItem: MediaItem = {
      ...selectedItemForSeasons,
      seasons: updatedSeasons,
    };

    const updatedCatalog = saveMediaItem(updatedItem);
    setCatalog(updatedCatalog);
    setSelectedItemForSeasons(updatedItem);
    setIsEpisodeModalOpen(false);
    setNewEpisode({
      number: (newEpisode.number || 1) + 1,
      title: "",
      duration: "24m",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail: selectedItemForSeasons.image,
    });
  };

  // Supprimer un épisode d'un dossier
  const handleDeleteEpisode = (seasonId: string, episodeId: string) => {
    if (!selectedItemForSeasons) return;
    if (confirm("Supprimer cet épisode ?")) {
      const updatedSeasons = (selectedItemForSeasons.seasons || []).map((s) => {
        if (s.id === seasonId) {
          const nextEpisodes = s.episodes.filter((e) => e.id !== episodeId);
          return {
            ...s,
            episodesCount: nextEpisodes.length,
            episodes: nextEpisodes,
          };
        }
        return s;
      });

      const updatedItem: MediaItem = {
        ...selectedItemForSeasons,
        seasons: updatedSeasons,
      };

      const updatedCatalog = saveMediaItem(updatedItem);
      setCatalog(updatedCatalog);
      setSelectedItemForSeasons(updatedItem);
    }
  };

  // Filtrage du catalogue affiché dans l'onglet Admin
  const filteredCatalog = catalog.filter((item) => {
    const matchCat = categoryFilter === "all" || item.category === categoryFilter;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <main className="min-h-screen bg-[#080a0f] text-white">
      <Navbar currentSpend={150} onOpenBilling={() => {}} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-28 pb-20">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500">
              <ShieldCheck className="h-4 w-4" />
              <span>Espace Super-Administrateur • Classement & Upload</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black text-white">
              Gestionnaire Vidéo & Dossiers de Saisons
            </h1>
            <p className="text-xs text-white/50 max-w-2xl">
              Classez vos films réels et animes par catégorie, organisez les saisons en dossiers interactifs et pilotez la facturation Fapshi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-medium text-white hover:bg-white/10 transition"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Voir le Site Public</span>
            </Link>

            <button
              onClick={handleResetCatalog}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white transition"
              title="Réinitialiser aux 17 titres officiels TMDB"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Réinitialiser (17 titres)</span>
            </button>

            <button
              onClick={() => {
                setEditingItem({
                  category: "anime",
                  title: "",
                  genre: "Isekai / Action",
                  year: "2024",
                  rating: "9.0",
                  duration: "Saison 1 • 12 ép.",
                  synopsis: "",
                  image: PRESET_ARTWORK[0].poster,
                  backdropUrl: PRESET_ARTWORK[0].backdrop,
                  videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                  license: "Licence Partenaire",
                  seasons: [],
                });
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-red-600/30 hover:brightness-110 active:scale-95 transition"
            >
              <Plus className="h-4 w-4" />
              <span>+ Uploader un Film ou Anime</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="mt-6 flex flex-wrap gap-2 border-b border-white/10 pb-4">
          {[
            { id: "catalog", label: "Catalogue & Catégories (Films / Animes)", icon: Film, count: catalog.length },
            { id: "seasons", label: "📁 Dossiers de Saisons & Épisodes", icon: Folder },
            { id: "stats", label: "Statistiques & Revenus (FCFA)", icon: TrendingUp },
            { id: "fapshi", label: "Paiements Fapshi (Orange / MTN)", icon: Smartphone },
            { id: "tarifs", label: "Tarifs & Plafond 1000F", icon: DollarSign },
          ].map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                activeTab === id
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
                  : "border border-white/5 bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
              {count !== undefined && (
                <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-white/90">
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: CATALOGUE MANAGEMENT WITH CATEGORY CLASSIFICATION */}
        {activeTab === "catalog" && (
          <div className="mt-8 space-y-6">
            {/* Filters bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0d0f16] p-4 rounded-2xl border border-white/10">
              {/* Category selector */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "all", label: "Tous" },
                  { id: "anime", label: "⚔️ Animes & Isekai" },
                  { id: "film", label: "🎬 Films Réels" },
                  { id: "serie", label: "📺 Séries Live-Action" },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setCategoryFilter(id as any)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      categoryFilter === id
                        ? "bg-red-600 text-white shadow"
                        : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Search in Admin */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
                <input
                  type="text"
                  placeholder="Filtrer par titre ou genre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-xl border border-white/10 bg-black/40 pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/40 outline-none focus:border-red-500 w-full sm:w-60"
                />
              </div>
            </div>

            {/* Grid of uploaded/existing films & animes */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCatalog.map((item) => {
                const seasonCount = item.seasons?.length || 0;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f16] p-4 transition hover:border-red-500/40"
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-28 w-20 rounded-xl object-cover border border-white/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                              item.category === "anime"
                                ? "bg-purple-900/60 text-purple-300 border border-purple-500/30"
                                : item.category === "film"
                                ? "bg-red-900/60 text-red-300 border border-red-500/30"
                                : "bg-blue-900/60 text-blue-300 border border-blue-500/30"
                            }`}
                          >
                            {item.category === "anime"
                              ? "⚔️ Anime"
                              : item.category === "film"
                              ? "🎬 Film"
                              : "📺 Série"}
                          </span>
                          {seasonCount > 0 && (
                            <span className="rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 text-[9px] font-bold flex items-center gap-1">
                              <Folder className="h-2.5 w-2.5" />
                              {seasonCount} Dossiers
                            </span>
                          )}
                        </div>

                        <h3 className="mt-1 text-sm font-bold text-white truncate">{item.title}</h3>
                        <p className="text-[11px] text-white/50">{item.genre} • {item.year}</p>
                        <p className="mt-1 text-[11px] text-amber-400 font-semibold">★ {item.rating}</p>
                        <p className="mt-1 text-[10px] text-emerald-400 truncate">
                          {item.license || "Licence vérifiée"}
                        </p>
                      </div>
                    </div>

                    {/* Backdrop Preview */}
                    <div className="mt-4 rounded-xl border border-white/5 bg-black/40 p-2.5 text-[11px] text-white/60">
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1 text-white/40">
                          <ImageIcon className="h-3 w-3" /> Affiche & Backdrop :
                        </span>
                        <span className="text-[10px] text-emerald-400">Haute Résolution TMDB</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-white/40">
                          <VideoIcon className="h-3 w-3" /> Source Stream :
                        </span>
                        <span className="text-[10px] text-white/70 truncate max-w-[140px]">
                          {item.videoUrl ? "Flux HLS / MP4 lié" : "Multi-épisodes"}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-2 border-t border-white/5 pt-3">
                      <button
                        onClick={() => {
                          setSelectedItemForSeasons(item);
                          if (item.seasons && item.seasons.length > 0) {
                            setTargetSeasonId(item.seasons[0].id);
                          }
                          setActiveTab("seasons");
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-amber-400 transition"
                      >
                        <Folder className="h-3.5 w-3.5 text-amber-400" />
                        <span>Dossiers ({seasonCount})</span>
                      </button>

                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsModalOpen(true);
                        }}
                        className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 hover:text-white hover:bg-white/10 transition"
                        title="Modifier"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/40 hover:text-red-400 hover:border-red-500/40 transition"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: SEASONS & FOLDERS MANAGER (DOSSIERS DES SAISONS D'UN ANIME) */}
        {activeTab === "seasons" && selectedItemForSeasons && (
          <div className="mt-8 space-y-6">
            {/* Selected Anime Card Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0d0f16] p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <img
                  src={selectedItemForSeasons.image}
                  alt={selectedItemForSeasons.title}
                  className="h-20 w-14 rounded-xl object-cover border border-white/15"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-red-400">Anime / Titre sélectionné :</span>
                    <span className="rounded bg-red-600/20 px-2 py-0.5 text-[10px] font-bold text-red-300">
                      {selectedItemForSeasons.category.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">{selectedItemForSeasons.title}</h2>
                  <p className="text-xs text-white/50">{selectedItemForSeasons.genre} • {selectedItemForSeasons.year}</p>
                </div>
              </div>

              {/* Selector to change anime & create season folder */}
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedItemForSeasons.id}
                  onChange={(e) => {
                    const found = catalog.find((i) => i.id === e.target.value);
                    if (found) {
                      setSelectedItemForSeasons(found);
                      if (found.seasons && found.seasons.length > 0) {
                        setTargetSeasonId(found.seasons[0].id);
                      }
                    }
                  }}
                  className="rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-xs text-white outline-none"
                >
                  {catalog.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.category === "anime" ? "⚔️" : i.category === "film" ? "🎬" : "📺"} {i.title}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    const nextNum = (selectedItemForSeasons.seasons?.length || 0) + 1;
                    setNewSeasonNumber(nextNum);
                    setNewFolderName(`📁 Dossier Saison ${nextNum}`);
                    setIsFolderModalOpen(true);
                  }}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:brightness-110 transition active:scale-95"
                >
                  <Folder className="h-4 w-4" />
                  <span>+ Nouveau Dossier Saison</span>
                </button>
              </div>
            </div>

            {/* Folders display */}
            <div className="space-y-6">
              {(selectedItemForSeasons.seasons || []).length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-12 text-center">
                  <Folder className="mx-auto h-12 w-12 text-white/20 mb-3" />
                  <h4 className="text-sm font-bold text-white">Aucun dossier de saison configuré</h4>
                  <p className="text-xs text-white/50 mt-1 max-w-md mx-auto">
                    Cet anime ou film n&apos;a pas encore de dossiers de saisons. Cliquez sur le bouton ci-dessous pour créer le premier dossier (ex: Saison 1).
                  </p>
                  <button
                    onClick={() => {
                      setNewSeasonNumber(1);
                      setNewFolderName("📁 Dossier Saison 1");
                      setIsFolderModalOpen(true);
                    }}
                    className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-red-500"
                  >
                    + Créer Dossier Saison 1
                  </button>
                </div>
              ) : (
                (selectedItemForSeasons.seasons || []).map((season) => (
                  <div
                    key={season.id}
                    className="rounded-2xl border border-white/10 bg-[#0d0f16] p-6 shadow-xl"
                  >
                    {/* Season Folder Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          <Folder className="h-5 w-5 fill-current" />
                        </span>
                        <div>
                          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                            <span>{season.folderName}</span>
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/70">
                              {season.episodes.length} épisodes
                            </span>
                          </h3>
                          <p className="text-[11px] text-white/40">
                            Saison {season.seasonNumber} • Année {season.year || "2024"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setTargetSeasonId(season.id);
                            setNewEpisode({
                              number: season.episodes.length + 1,
                              title: `Épisode ${season.episodes.length + 1}`,
                              duration: "24m",
                              videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                              thumbnail: selectedItemForSeasons.image,
                            });
                            setIsEpisodeModalOpen(true);
                          }}
                          className="flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-red-500 transition shadow"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>+ Ajouter Épisode</span>
                        </button>

                        <button
                          onClick={() => handleDeleteSeasonFolder(season.id)}
                          className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/40 hover:text-red-400 hover:border-red-500/40 transition"
                          title="Supprimer ce dossier"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Episodes List in Folder */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {season.episodes.map((ep) => (
                        <div
                          key={ep.id}
                          className="group relative flex gap-3 rounded-xl border border-white/5 bg-[#141722] p-3 hover:border-white/20 transition"
                        >
                          <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-lg bg-black">
                            <img
                              src={ep.thumbnail || selectedItemForSeasons.image}
                              alt={ep.title}
                              className="h-full w-full object-cover"
                            />
                            <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-[8px] font-bold text-white">
                              {ep.duration}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <span className="text-[10px] font-bold text-red-400">Épisode {ep.number}</span>
                              <h5 className="text-xs font-bold text-white truncate">{ep.title}</h5>
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-[9px] text-white/40 truncate max-w-[110px]">
                                {ep.videoUrl.split("/").pop()}
                              </span>
                              <button
                                onClick={() => handleDeleteEpisode(season.id, ep.id)}
                                className="text-white/40 hover:text-red-400 transition"
                                title="Supprimer cet épisode"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: STATS (FCFA) */}
        {activeTab === "stats" && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: "Volume Total Téléchargé", val: "14,850 Titres", sub: "+24% ce mois", icon: HardDrive },
              { label: "Recettes Globales (FCFA)", val: "1,485,000 FCFA", sub: "Via Orange & MTN", icon: TrendingUp },
              { label: "Abonnés Actifs", val: "3,420 Utilisateurs", sub: "Cameroun / Gabon / Tchad", icon: Users },
              { label: "Plafond 1000F Activé", val: "892 Pass Actifs", sub: "Illimité mensuel", icon: CheckCircle2 },
            ].map(({ label, val, sub, icon: Icon }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-[#0d0f16] p-5 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/50">{label}</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600/20 text-red-400">
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <div className="mt-2 text-2xl font-black text-white">{val}</div>
                <div className="mt-1 text-xs text-emerald-400 font-semibold">{sub}</div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: FAPSHI GATEWAY */}
        {activeTab === "fapshi" && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#0d0f16] p-6 max-w-2xl">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-red-500" />
              <span>Passerelle Fapshi Mobile Money</span>
            </h3>
            <p className="mt-1 text-xs text-white/50">
              Collecte instantanée Orange Money et MTN Mobile Money en Afrique Centrale.
            </p>
            <div className="mt-6 space-y-4 text-xs">
              <div>
                <label className="block text-white/70 mb-1 font-semibold">API Key Fapshi (Production) :</label>
                <input
                  type="password"
                  value="fp_live_9a87bc654e3210fe"
                  readOnly
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-white/60 font-mono"
                />
              </div>
              <div>
                <label className="block text-white/70 mb-1 font-semibold">Webhook URL :</label>
                <input
                  type="text"
                  value="https://cinewheel.com/api/webhooks/fapshi"
                  readOnly
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-white/60 font-mono"
                />
              </div>
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-emerald-300">
                ✓ Webhook synchronisé : reversements automatiques 50 FCFA / téléchargement et 100 FCFA / heure.
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TARIFS */}
        {activeTab === "tarifs" && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#0d0f16] p-6 max-w-2xl">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-amber-400" />
              <span>Grille Tarifaire Afrique Centrale</span>
            </h3>
            <div className="mt-6 space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span>Streaming à l'heure (Uniquement en lecture) :</span>
                <span className="font-bold text-amber-400">100 FCFA / Heure</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span>Téléchargement par épisode ou film :</span>
                <span className="font-bold text-amber-400">50 FCFA / Titre</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span>Plafond Maximal Garanti :</span>
                <span className="font-bold text-emerald-400">1 000 FCFA = 100% Gratuit ensuite</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: NOUVEAU / MODIFIER UN FILM OU ANIME */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl overflow-y-auto">
          <div className="relative my-8 w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0f121a] p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-xl font-black text-white mb-2">
              {editingItem.id ? "Modifier le Titre" : "Uploader & Classer un Nouveau Titre"}
            </h3>
            <p className="text-xs text-white/50 mb-6">
              Choisissez sa catégorie (Anime, Film réel ou Série) et configurez son affiche réelle et ses dossiers.
            </p>

            <div className="space-y-4 text-xs">
              {/* Category Selector */}
              <div>
                <label className="block text-white/70 mb-1.5 font-bold">Catégorie Principale :</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "anime", label: "⚔️ Anime & Isekai" },
                    { id: "film", label: "🎬 Film Réel" },
                    { id: "serie", label: "📺 Série Live-Action" },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setEditingItem({ ...editingItem, category: id as MediaCategory })}
                      className={`rounded-xl border p-2.5 font-bold text-center transition ${
                        editingItem.category === id
                          ? "border-red-500 bg-red-600 text-white shadow"
                          : "border-white/10 bg-black/40 text-white/60 hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Raccourci Affiches Réelles TMDB */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                <label className="block text-amber-300 font-bold mb-1">
                  💡 Affiches Réelles Recommandées (TMDB Haute Définition) :
                </label>
                <select
                  onChange={(e) => {
                    const preset = PRESET_ARTWORK.find((p) => p.label === e.target.value);
                    if (preset) {
                      setEditingItem((prev) => ({
                        ...prev,
                        title: prev.title || preset.label.split("] ")[1],
                        category: preset.category,
                        image: preset.poster,
                        backdropUrl: preset.backdrop,
                      }));
                    }
                  }}
                  className="w-full rounded-lg border border-white/20 bg-black/60 p-2 text-xs text-white outline-none"
                >
                  <option value="">Sélectionner une affiche réelle vérifiée...</option>
                  {PRESET_ARTWORK.map((p) => (
                    <option key={p.label} value={p.label}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title & Genre */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1 font-semibold">Titre :</label>
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    placeholder="Ex: Solo Leveling: Arise"
                    className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-white outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1 font-semibold">Genre / Sous-Catégorie :</label>
                  <input
                    type="text"
                    value={editingItem.genre}
                    onChange={(e) => setEditingItem({ ...editingItem, genre: e.target.value })}
                    placeholder="Ex: Isekai / Action"
                    className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-white outline-none"
                  />
                </div>
              </div>

              {/* Year, Rating, Duration */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-white/70 mb-1 font-semibold">Année :</label>
                  <input
                    type="text"
                    value={editingItem.year}
                    onChange={(e) => setEditingItem({ ...editingItem, year: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1 font-semibold">Note (/10) :</label>
                  <input
                    type="text"
                    value={editingItem.rating}
                    onChange={(e) => setEditingItem({ ...editingItem, rating: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1 font-semibold">Durée :</label>
                  <input
                    type="text"
                    value={editingItem.duration}
                    onChange={(e) => setEditingItem({ ...editingItem, duration: e.target.value })}
                    placeholder="2 Saisons • 24 ép."
                    className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-white outline-none"
                  />
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <label className="block text-white/70 mb-1 font-semibold">Synopsis / Résumé :</label>
                <textarea
                  rows={3}
                  value={editingItem.synopsis}
                  onChange={(e) => setEditingItem({ ...editingItem, synopsis: e.target.value })}
                  placeholder="Résumé de l'anime ou du film..."
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-white outline-none focus:border-red-500"
                />
              </div>

              {/* Poster 2:3 */}
              <div className="rounded-xl border border-white/10 bg-black/30 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4 text-red-500" />
                    <span>Affiche Officielle (Poster 2:3)</span>
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    ref={posterFileRef}
                    onChange={(e) => handleFileUpload(e, "image")}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => posterFileRef.current?.click()}
                    className="flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-white hover:bg-white/10"
                  >
                    <Upload className="h-3 w-3" />
                    <span>Importer Fichier</span>
                  </button>
                </div>
                <div className="flex gap-3 items-center">
                  {editingItem.image && (
                    <img
                      src={editingItem.image}
                      alt="Preview"
                      className="h-16 w-11 rounded-lg object-cover border border-white/20 shrink-0"
                    />
                  )}
                  <input
                    type="text"
                    value={editingItem.image}
                    onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                    placeholder="URL Image Affiche (ex: https://image.tmdb.org/...)"
                    className="w-full rounded-lg border border-white/10 bg-black/50 p-2 text-[11px] text-white"
                  />
                </div>
              </div>

              {/* Backdrop 16:9 */}
              <div className="rounded-xl border border-white/10 bg-black/30 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4 text-amber-400" />
                    <span>Bannière Large (Backdrop 16:9)</span>
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    ref={backdropFileRef}
                    onChange={(e) => handleFileUpload(e, "backdropUrl")}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => backdropFileRef.current?.click()}
                    className="flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] text-white hover:bg-white/10"
                  >
                    <Upload className="h-3 w-3" />
                    <span>Importer Backdrop</span>
                  </button>
                </div>
                <div className="flex gap-3 items-center">
                  {editingItem.backdropUrl && (
                    <img
                      src={editingItem.backdropUrl}
                      alt="Preview Backdrop"
                      className="h-12 w-20 rounded-lg object-cover border border-white/20 shrink-0"
                    />
                  )}
                  <input
                    type="text"
                    value={editingItem.backdropUrl}
                    onChange={(e) => setEditingItem({ ...editingItem, backdropUrl: e.target.value })}
                    placeholder="URL Image Large (16:9)..."
                    className="w-full rounded-lg border border-white/10 bg-black/50 p-2 text-[11px] text-white"
                  />
                </div>
              </div>

              {/* Stream Video URL */}
              <div>
                <label className="block text-white/70 mb-1 font-semibold">Source Vidéo (MP4 / HLS) :</label>
                <input
                  type="text"
                  value={editingItem.videoUrl}
                  onChange={(e) => setEditingItem({ ...editingItem, videoUrl: e.target.value })}
                  placeholder="https://.../video.mp4"
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-white outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveItem}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 py-3 text-xs font-bold text-white shadow-xl hover:brightness-110 active:scale-95 transition"
              >
                <Save className="h-4 w-4" />
                <span>Enregistrer dans le Catalogue</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NOUVEAU DOSSIER SAISON */}
      {isFolderModalOpen && selectedItemForSeasons && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0f121a] p-6 text-white shadow-2xl">
            <button
              onClick={() => setIsFolderModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-black text-white flex items-center gap-2 mb-2">
              <Folder className="h-5 w-5 text-red-500" />
              <span>Nouveau Dossier de Saison</span>
            </h3>
            <p className="text-xs text-white/50 mb-4">
              Ajouter un dossier de saison pour : <strong>{selectedItemForSeasons.title}</strong>
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-white/70 mb-1 font-semibold">Numéro de la Saison :</label>
                <input
                  type="number"
                  value={newSeasonNumber}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    setNewSeasonNumber(n);
                    setNewFolderName(`📁 Dossier Saison ${n}`);
                  }}
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-semibold">Nom du Dossier :</label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Ex: 📁 Dossier Saison 2 : Le Combat de Shibuya"
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-white outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-semibold">Année de Sortie :</label>
                <input
                  type="text"
                  value={newSeasonYear}
                  onChange={(e) => setNewSeasonYear(e.target.value)}
                  placeholder="2024"
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-white outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleCreateSeasonFolder}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-xs font-bold text-white hover:bg-red-500 transition shadow"
              >
                <Folder className="h-4 w-4" />
                <span>Créer ce Dossier</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AJOUTER UN ÉPISODE AU DOSSIER */}
      {isEpisodeModalOpen && selectedItemForSeasons && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-xl">
          <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0f121a] p-6 text-white shadow-2xl">
            <button
              onClick={() => setIsEpisodeModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Plus className="h-4 w-4 text-red-500" />
              <span>Ajouter un Épisode au Dossier</span>
            </h3>
            <p className="text-xs text-white/50 mb-4">
              Titre : <strong>{selectedItemForSeasons.title}</strong>
            </p>

            <div className="space-y-3 text-xs">
              {/* Dossier Cible */}
              <div>
                <label className="block text-white/70 mb-1 font-semibold">Dossier de Saison Cible :</label>
                <select
                  value={targetSeasonId}
                  onChange={(e) => setTargetSeasonId(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-white outline-none"
                >
                  {(selectedItemForSeasons.seasons || []).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.folderName} ({s.episodes.length} épisodes actuels)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 mb-1 font-semibold">Numéro d&apos;épisode :</label>
                  <input
                    type="number"
                    value={newEpisode.number}
                    onChange={(e) => setNewEpisode({ ...newEpisode, number: Number(e.target.value) })}
                    className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/70 mb-1 font-semibold">Durée estimée :</label>
                  <input
                    type="text"
                    value={newEpisode.duration}
                    onChange={(e) => setNewEpisode({ ...newEpisode, duration: e.target.value })}
                    placeholder="24m"
                    className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-semibold">Titre de l&apos;épisode :</label>
                <input
                  type="text"
                  value={newEpisode.title}
                  onChange={(e) => setNewEpisode({ ...newEpisode, title: e.target.value })}
                  placeholder="Ex: Épisode 1 : Le Réveil de l'Ombre"
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-white outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-semibold">Miniature Photo (URL) :</label>
                <input
                  type="text"
                  value={newEpisode.thumbnail}
                  onChange={(e) => setNewEpisode({ ...newEpisode, thumbnail: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-white/70 mb-1 font-semibold">Fichier ou Lien Vidéo :</label>
                <input
                  type="text"
                  value={newEpisode.videoUrl}
                  onChange={(e) => setNewEpisode({ ...newEpisode, videoUrl: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/40 p-2.5 text-white outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleAddEpisodeToFolder}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-xs font-bold text-white hover:bg-red-500 transition shadow"
              >
                <Plus className="h-4 w-4" />
                <span>Enregistrer cet Épisode dans le Dossier</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
