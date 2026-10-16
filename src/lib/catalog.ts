export interface Episode {
  id: string;
  number: number;
  title: string;
  duration: string;
  videoUrl: string;
  thumbnail: string;
  synopsis?: string;
}

export interface SeasonFolder {
  id: string;
  seasonNumber: number;
  folderName: string; // Ex: "📁 Dossier Saison 1 : L'Éveil de l'Ombre"
  year?: string;
  episodesCount: number;
  episodes: Episode[];
}

export type MediaCategory = "anime" | "film" | "serie";

export interface MediaItem {
  id: string;
  title: string;
  category: MediaCategory;
  genre: string;
  year: string;
  rating: string;
  duration: string;
  synopsis: string;
  image: string; // Affiche principale (Poster)
  backdropUrl?: string; // Image de fond large
  videoUrl?: string; // Lecteur direct / bande-annonce
  href?: string;
  license?: string;
  isUploaded?: boolean;
  seasons?: SeasonFolder[]; // Dossiers de saisons pour animes et séries
}

export const INITIAL_CATALOG: MediaItem[] = [
  // ==========================================
  // ⚔️ ANIMES & ISEKAI (AVEC DOSSIERS DE SAISONS)
  // ==========================================
  {
    id: "solo-leveling",
    title: "Solo Leveling: Arise",
    category: "anime",
    genre: "Isekai / Action & Donjons",
    year: "2024",
    rating: "9.8",
    duration: "2 Saisons • 25 ép.",
    synopsis: "Dans un monde où d'immenses portails relient notre terre à des donjons remplis de bêtes féroces, Sung Jin-woo, le plus faible des chasseurs de rang E, reçoit l'accès à un 'Système' secret qui lui permet de monter de niveau sans limites.",
    image: "https://image.tmdb.org/t/p/w500/geCRueV3ElhRTr0xtJuEWJt6dJ1.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/xMNH87maNLt9n2bMDYeI6db5VFm.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    license: "Licence Officielle A-1 Pictures / Crunchyroll Afrique",
    seasons: [
      {
        id: "solo-s1",
        seasonNumber: 1,
        folderName: "📁 Dossier Saison 1 : L'Éveil de l'Ombre",
        year: "2024",
        episodesCount: 12,
        episodes: [
          {
            id: "sl-ep1",
            number: 1,
            title: "Je suis habitué",
            duration: "24m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w500/geCRueV3ElhRTr0xtJuEWJt6dJ1.jpg",
            synopsis: "Sung Jin-woo et son équipe pénètrent dans un double donjon mortel gouverné par d'étranges statues de pierre colossales.",
          },
          {
            id: "sl-ep2",
            number: 2,
            title: "Si j'avais une chance supplémentaire",
            duration: "23m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w1280/xMNH87maNLt9n2bMDYeI6db5VFm.jpg",
            synopsis: "Laissé pour mort, Jin-woo se réveille dans un lit d'hôpital face à une mystérieuse fenêtre d'interface que lui seul peut voir.",
          },
          {
            id: "sl-ep3",
            number: 3,
            title: "C'est comme un jeu vidéo",
            duration: "24m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w500/geCRueV3ElhRTr0xtJuEWJt6dJ1.jpg",
            synopsis: "Jin-woo accomplit ses quêtes quotidiennes et explore son premier donjon instantané dans la station de métro désaffectée.",
          },
          {
            id: "sl-ep6",
            number: 6,
            title: "Le vrai massacre commence",
            duration: "24m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w1280/xMNH87maNLt9n2bMDYeI6db5VFm.jpg",
            synopsis: "Trahison dans le donjon de rang C. Jin-woo doit prendre une décision cruciale : tuer pour survivre.",
          },
          {
            id: "sl-ep12",
            number: 12,
            title: "Debout (Arise)",
            duration: "25m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w500/geCRueV3ElhRTr0xtJuEWJt6dJ1.jpg",
            synopsis: "Changement de classe épique : Jin-woo affronte le commandant sanguinaire Igris et débloque le pouvoir de lever les ombres.",
          },
        ],
      },
      {
        id: "solo-s2",
        seasonNumber: 2,
        folderName: "📁 Dossier Saison 2 : Arise from the Shadow",
        year: "2025",
        episodesCount: 13,
        episodes: [
          {
            id: "sl2-ep1",
            number: 1,
            title: "L'Ombre du Monarque",
            duration: "24m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w1280/xMNH87maNLt9n2bMDYeI6db5VFm.jpg",
            synopsis: "La renommée de Jin-woo dépasse les frontières. Le raid de l'île de Jeju se prépare avec l'élite des chasseurs de rang S.",
          },
          {
            id: "sl2-ep2",
            number: 2,
            title: "La Porte Rouge Enneigée",
            duration: "24m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w500/geCRueV3ElhRTr0xtJuEWJt6dJ1.jpg",
            synopsis: "Un piège s'ouvre sous les pas des recrues de la guilde du Tigre Blanc. Jin-woo doit révéler sa force à ciel ouvert.",
          },
        ],
      },
    ],
  },
  {
    id: "jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    category: "anime",
    genre: "Shonen / Exorcisme & Fléaux",
    year: "2023",
    rating: "9.7",
    duration: "2 Saisons + Film • 48 ép.",
    synopsis: "Pour sauver ses camarades de classe d'une attaque de monstres nés des émotions négatives, Yuji Itadori avale un doigt du roi des fléaux Ryomen Sukuna et intègre l'école d'exorcisme de Tokyo sous la tutelle de Satoru Gojo.",
    image: "https://image.tmdb.org/t/p/w500/6qQzMJG27XOJsyAEEIisoJB45j2.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/qpin8cASXEVtwhzNsprHYFiOAGk.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    license: "MAPPA Studios / TOHO Animation",
    seasons: [
      {
        id: "jjk-s1",
        seasonNumber: 1,
        folderName: "📁 Dossier Saison 1 : L'Héritier de Sukuna",
        year: "2020",
        episodesCount: 24,
        episodes: [
          {
            id: "jjk-ep1",
            number: 1,
            title: "Ryomen Sukuna",
            duration: "24m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w500/6qQzMJG27XOJsyAEEIisoJB45j2.jpg",
            synopsis: "Yuji Itadori prend une décision désespérée pour protéger ses amis du lycée contre un fléau de classe supérieure.",
          },
          {
            id: "jjk-ep20",
            number: 20,
            title: "Hors Normes",
            duration: "24m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w1280/qpin8cASXEVtwhzNsprHYFiOAGk.jpg",
            synopsis: "Aoi Todo et Yuji Itadori déchaînent le Rayon Noir en parfaite harmonie face au fléau Hanami.",
          },
        ],
      },
      {
        id: "jjk-s2",
        seasonNumber: 2,
        folderName: "📁 Dossier Saison 2 : Le Drame de Shibuya",
        year: "2023",
        episodesCount: 23,
        episodes: [
          {
            id: "jjk2-ep1",
            number: 1,
            title: "Trésor Caché (Jeunesse de Gojo)",
            duration: "24m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w1280/qpin8cASXEVtwhzNsprHYFiOAGk.jpg",
            synopsis: "Retour en 2006. Satoru Gojo et Suguru Geto sont chargés de protéger le plasma stellaire face au redoutable Toji Fushiguro.",
          },
          {
            id: "jjk2-ep9",
            number: 9,
            title: "L'Incident de Shibuya — Scellé",
            duration: "24m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w500/6qQzMJG27XOJsyAEEIisoJB45j2.jpg",
            synopsis: "31 octobre, 19h00. Le rideau tombe sur la station de Shibuya. La prison des frontières s'ouvre pour piéger le plus puissant des exorcistes.",
          },
        ],
      },
    ],
  },
  {
    id: "demon-slayer",
    title: "Demon Slayer: Kimetsu no Yaiba",
    category: "anime",
    genre: "Shonen / Sabres & Pourfendeurs",
    year: "2024",
    rating: "9.6",
    duration: "4 Saisons • 55 ép.",
    synopsis: "Après le massacre de sa famille par un démon et la métamorphose de sa sœur cadette Nezuko en créature de la nuit, Tanjiro Kamado s'engage dans le Corps des Pourfendeurs de Démons pour lui rendre son humanité.",
    image: "https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/3GQKYh6Trm8pxd2AypovoYQf4Ay.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    license: "ufotable / Aniplex Official",
    seasons: [
      {
        id: "ds-s1",
        seasonNumber: 1,
        folderName: "📁 Dossier Saison 1 : La Détermination de Tanjiro",
        year: "2019",
        episodesCount: 26,
        episodes: [
          {
            id: "ds-ep1",
            number: 1,
            title: "Cruauté",
            duration: "24m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",
            synopsis: "La tragédie frappe la famille Kamado. Giyu Tomioka, pilier de l'Eau, épargne Nezuko et envoie Tanjiro vers Urokodaki.",
          },
          {
            id: "ds-ep19",
            number: 19,
            title: "Le Dieu du Feu (Hinokami Kagura)",
            duration: "24m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w1280/3GQKYh6Trm8pxd2AypovoYQf4Ay.jpg",
            synopsis: "Sur le mont Natagumo, acculé par Rui de la 5e Lune Inférieure, Tanjiro réveille la danse du Dieu du Feu léguée par son père.",
          },
        ],
      },
      {
        id: "ds-s2",
        seasonNumber: 2,
        folderName: "📁 Dossier Saison 2 : Le Quartier des Plaisirs",
        year: "2021",
        episodesCount: 18,
        episodes: [
          {
            id: "ds2-ep1",
            number: 1,
            title: "Tengen Uzui, Pilier du Son",
            duration: "45m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w1280/3GQKYh6Trm8pxd2AypovoYQf4Ay.jpg",
            synopsis: "Infiltration flamboyante dans les ruelles éclairées aux lanternes de Yoshiwara pour débusquer Daki.",
          },
        ],
      },
      {
        id: "ds-s3",
        seasonNumber: 3,
        folderName: "📁 Dossier Saison 3 : Le Village des Forgerons",
        year: "2023",
        episodesCount: 11,
        episodes: [
          {
            id: "ds3-ep1",
            number: 1,
            title: "Le Village Secret de Nichirin",
            duration: "49m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",
            synopsis: "Tanjiro se rend au village secret pour réparer son sabre et fait la rencontre de Muichiro Tokito et Mitsuri Kanroji.",
          },
        ],
      },
      {
        id: "ds-s4",
        seasonNumber: 4,
        folderName: "📁 Dossier Saison 4 : L'Entraînement des Piliers",
        year: "2024",
        episodesCount: 8,
        episodes: [
          {
            id: "ds4-ep1",
            number: 1,
            title: "Pour vaincre Muzan Kibutsuji",
            duration: "48m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w1280/3GQKYh6Trm8pxd2AypovoYQf4Ay.jpg",
            synopsis: "Tous les pourfendeurs participent à un entraînement titanesque supervisé par les Piliers avant le combat final.",
          },
        ],
      },
    ],
  },
  {
    id: "attack-on-titan",
    title: "L'Attaque des Titans (Shingeki no Kyojin)",
    category: "anime",
    genre: "Dark Fantasy / Épopée Militaire",
    year: "2023",
    rating: "9.9",
    duration: "4 Saisons • 89 ép.",
    synopsis: "Retranchée derrière trois immenses murs protecteurs face à des géants anthropophages dévastateurs, l'humanité découvre la vérité glaçante sur ses origines à travers la révolte sans pitié d'Eren Jaeger.",
    image: "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    license: "Wit Studio & MAPPA / Kodansha",
    seasons: [
      {
        id: "aot-s1",
        seasonNumber: 1,
        folderName: "📁 Dossier Saison 1 : La Chute de Shiganshina",
        year: "2013",
        episodesCount: 25,
        episodes: [
          {
            id: "aot-ep1",
            number: 1,
            title: "À toi, dans deux mille ans",
            duration: "24m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg",
            synopsis: "Le Titan Colossal et le Titan Cuirassé percent le Mur Maria. Le monde paisible d'Eren s'effondre dans le sang.",
          },
        ],
      },
      {
        id: "aot-s4",
        seasonNumber: 4,
        folderName: "📁 Dossier Saison 4 : La Saison Finale & Le Grand Terrassement",
        year: "2023",
        episodesCount: 30,
        episodes: [
          {
            id: "aot4-ep1",
            number: 1,
            title: "De l'autre côté de l'océan",
            duration: "24m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w1280/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg",
            synopsis: "Guerre impériale sur le continent de Mahr. La nouvelle génération de guerriers eldiens combat pour survivre.",
          },
          {
            id: "aot4-epfinal",
            number: 30,
            title: "Le Grand Terrassement (Épisode Spécial)",
            duration: "85m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg",
            synopsis: "La marche inexorable des millions de titans colossaux menace de réduire la terre en cendres. Armin et Mikasa font leur adieu.",
          },
        ],
      },
    ],
  },
  {
    id: "rezero",
    title: "Re:Zero — Starting Life in Another World",
    category: "anime",
    genre: "Isekai / Psychologique & Magie",
    year: "2024",
    rating: "9.4",
    duration: "3 Saisons • 58 ép.",
    synopsis: "Subaru Natsuki est aspiré dans un royaume de fantasy où il découvre une malédiction terrifiante : la 'Mort Réversible'. Chaque fois qu'il périt, le temps se rembobine à un instant critique qu'il doit réécrire pour sauver Emilia et ses compagnes.",
    image: "https://image.tmdb.org/t/p/w500/oHqYrPAsIiTD5m4DuxumV4er8BU.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/7ZruEnSnHD6Jx5mF0hBt1E306Vt.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    license: "White Fox Studio / Kadokawa",
    seasons: [
      {
        id: "rz-s1",
        seasonNumber: 1,
        folderName: "📁 Dossier Saison 1 : La Boucle de la Capitale",
        year: "2016",
        episodesCount: 25,
        episodes: [
          {
            id: "rz-ep1",
            number: 1,
            title: "La Fin du Début et le Début de la Fin",
            duration: "48m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w500/oHqYrPAsIiTD5m4DuxumV4er8BU.jpg",
            synopsis: "Subaru rencontre la demi-elfe aux cheveux d'argent et fait face à la cruelle tueuse aux boyaux Elsa Granhiert.",
          },
        ],
      },
      {
        id: "rz-s2",
        seasonNumber: 2,
        folderName: "📁 Dossier Saison 2 : Le Sanctuaire d'Echidna",
        year: "2020",
        episodesCount: 25,
        episodes: [
          {
            id: "rz2-ep1",
            number: 1,
            title: "Chacun son Serment",
            duration: "26m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w1280/7ZruEnSnHD6Jx5mF0hBt1E306Vt.jpg",
            synopsis: "L'archevêque de la Gourmandise dévore l'existence même de Rem. Subaru jure de trouver un moyen de la réveiller.",
          },
        ],
      },
      {
        id: "rz-s3",
        seasonNumber: 3,
        folderName: "📁 Dossier Saison 3 : L'Attaque de Priestella",
        year: "2024",
        episodesCount: 16,
        episodes: [
          {
            id: "rz3-ep1",
            number: 1,
            title: "La Cité Aquatique de Priestella",
            duration: "90m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w500/oHqYrPAsIiTD5m4DuxumV4er8BU.jpg",
            synopsis: "Épisode d'ouverture grandiose de 90 minutes. Les archevêques du Culte de la Sorcière lancent une attaque coordonnée sur la cité marchande.",
          },
        ],
      },
    ],
  },
  {
    id: "frieren",
    title: "Frieren: Beyond Journey's End",
    category: "anime",
    genre: "Fantasy / Aventure Poétique",
    year: "2024",
    rating: "9.9",
    duration: "Saison 1 • 28 ép.",
    synopsis: "Après avoir terrassé le Roi Démon aux côtés du héros Himmel, la magicienne elfe Frieren, dont l'espérance de vie est quasi-infinie, entame un voyage mélancolique à travers le monde pour mieux comprendre le cœur et les sentiments éphémères des humains.",
    image: "https://image.tmdb.org/t/p/w500/dqZENchTd7lp5zht7BdlqM7RBhD.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/rBOnrVlck7BIlGeWVlzYiZeg4l2.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    license: "Madhouse / Toho Animation",
    seasons: [
      {
        id: "frieren-s1",
        seasonNumber: 1,
        folderName: "📁 Dossier Saison 1 : Le Voyage vers l'Aureole",
        year: "2024",
        episodesCount: 28,
        episodes: [
          {
            id: "fr-ep1",
            number: 1,
            title: "La Fin du Voyage",
            duration: "24m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w500/dqZENchTd7lp5zht7BdlqM7RBhD.jpg",
            synopsis: "Cinquante ans après la victoire contre le Roi Démon, la pluie de comètes d'Era réunit une dernière fois les quatre compagnons d'armes.",
          },
          {
            id: "fr-ep26",
            number: 26,
            title: "Le Sommet de la Magie",
            duration: "24m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w1280/rBOnrVlck7BIlGeWVlzYiZeg4l2.jpg",
            synopsis: "Frieren et Fern affrontent le clone parfait de Frieren dans la tombe royale au terme d'un duel magique spectaculaire.",
          },
        ],
      },
    ],
  },
  {
    id: "one-piece",
    title: "One Piece: Arc Egghead",
    category: "anime",
    genre: "Shonen / Piraterie & Mythes",
    year: "2024",
    rating: "9.7",
    duration: "Saison Egghead • 45 ép.",
    synopsis: "Monkey D. Luffy et l'équipage du Chapeau de Paille accostent sur Egghead, l'île futuriste du génial Dr Vegapunk, défiant directement les Cinq Doyens du Gouvernement Mondial sous sa forme légendaire du Dieu du Soleil Nika (Gear 5).",
    image: "https://image.tmdb.org/t/p/w500/dB4EDhre2dsC2kxYDavyKWqLQwi.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/v38qp4bySLTXYu3MF8r5GD51FN3.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    license: "Toei Animation / Eiichiro Oda",
    seasons: [
      {
        id: "op-egghead",
        seasonNumber: 21,
        folderName: "📁 Dossier Arc Egghead : L'Île du Futur",
        year: "2024",
        episodesCount: 45,
        episodes: [
          {
            id: "op-ep1089",
            number: 1089,
            title: "Un Nouveau Chapitre ! Le Cap sur Egghead",
            duration: "24m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w500/dB4EDhre2dsC2kxYDavyKWqLQwi.jpg",
            synopsis: "L'équipage du Chapeau de Paille quitte le pays de Wano et pénètre dans les mers hautement technologiques d'Egghead.",
          },
          {
            id: "op-ep1100",
            number: 1100,
            title: "Puissance d'un Dieu : Gear 5 contre Lucci éveillé",
            duration: "24m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w1280/v38qp4bySLTXYu3MF8r5GD51FN3.jpg",
            synopsis: "Luffy active le Gear 5 au son des Tambours de la Libération pour un duel déchaîné contre Rob Lucci du CP0.",
          },
        ],
      },
    ],
  },

  // ==========================================
  // 🎬 FILMS RÉELS (CINÉMA & BLOCKBUSTERS)
  // ==========================================
  {
    id: "dune-part-two",
    title: "Dune: Deuxième Partie",
    category: "film",
    genre: "Sci-Fi / Épique Spatial",
    year: "2024",
    rating: "9.5",
    duration: "2h 46m",
    synopsis: "Paul Atréides s'unit à Chani et aux Fremen pour mener la révolte contre ceux qui ont anéanti sa famille. Pris entre l'amour de sa vie et le destin de l'univers connu, il doit empêcher un avenir sanglant que lui seul peut prédire.",
    image: "https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/eZ239CUp1d6OryZEBPnO2n87gMG.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    license: "Warner Bros. Pictures / Legendary",
  },
  {
    id: "oppenheimer",
    title: "Oppenheimer",
    category: "film",
    genre: "Historique / Thriller & Drame",
    year: "2023",
    rating: "9.3",
    duration: "3h 00m",
    synopsis: "L'histoire captivante et tourmentée du physicien J. Robert Oppenheimer, directeur du Laboratoire de Los Alamos durant le Projet Manhattan et père de la bombe atomique qui a changé le cours de l'humanité à jamais.",
    image: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/neeNHeXjMF5fXoCJRsOmkNGC7q.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    license: "Universal Pictures / Syncopy",
  },
  {
    id: "interstellar",
    title: "Interstellar",
    category: "film",
    genre: "Sci-Fi / Espace & Trou Noir",
    year: "2014",
    rating: "9.7",
    duration: "2h 49m",
    synopsis: "Tandis que la Terre se meurt sous des tempêtes de poussière, un groupe d'astronautes et explorateurs franchit un trou de ver apparu près de Saturne pour trouver un nouveau foyer viable pour l'espèce humaine.",
    image: "https://image.tmdb.org/t/p/w500/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/8sNiAPPYU14PUepFNeSNGUTiHW.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    license: "Paramount Pictures / Warner Bros.",
  },
  {
    id: "gladiator-ii",
    title: "Gladiator II",
    category: "film",
    genre: "Péplum / Action Épique",
    year: "2024",
    rating: "8.9",
    duration: "2h 28m",
    synopsis: "Des années après la mort du valeureux Maximus, Lucius est jeté dans l'arène sanglante du Colisée après la conquête de sa terre par les empereurs tyrans qui gouvernent Rome d'une main d'acier. Il cherche la force de rendre la gloire de Rome à son peuple.",
    image: "https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/tOqIwliWMovSIZ9DyvHcHI7p2im.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    license: "Paramount Pictures / Scott Free",
  },
  {
    id: "spider-man-across-spider-verse",
    title: "Spider-Man: Across the Spider-Verse",
    category: "film",
    genre: "Animation / Multivers & Marvel",
    year: "2023",
    rating: "9.6",
    duration: "2h 20m",
    synopsis: "Miles Morales est catapulté à travers le Multivers où il rencontre la Spider Society, une alliance d'élite de héros arachnéens. Confronté à un dilemme déchirant sur le destin des univers, Miles choisit de redéfinir ce que signifie être un héros.",
    image: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/kVd3a9YeLGkoeR50jGEXM6EqseS.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    license: "Sony Pictures Animation / Marvel",
  },
  {
    id: "deadpool-and-wolverine",
    title: "Deadpool & Wolverine",
    category: "film",
    genre: "Action / Comédie & Super-Héros",
    year: "2024",
    rating: "9.1",
    duration: "2h 08m",
    synopsis: "Wade Wilson a remisé ses katanas pour une vie civile morose. Mais lorsqu'une menace universelle pèse sur sa chronologie, il doit bon gré mal gré renfiler le costume et s'allier à un Wolverine au bout du rouleau pour sauver son univers.",
    image: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/by8z9Fe8y7p4jo2YlW2SZDnptyT.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    license: "Marvel Studios / 20th Century Studios",
  },
  {
    id: "the-batman",
    title: "The Batman",
    category: "film",
    genre: "Polar Noir / Thriller & Enquête",
    year: "2022",
    rating: "9.0",
    duration: "2h 56m",
    synopsis: "Dans sa deuxième année de lutte contre la pègre, Bruce Wayne plonge dans les bas-fonds poisseux de Gotham City à la poursuite du Sphinx, un tueur en série sadiquement méthodique qui cible l'élite corrompue de la ville.",
    image: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    license: "Warner Bros. / DC Films",
  },
  {
    id: "blade-runner-2049",
    title: "Blade Runner 2049",
    category: "film",
    genre: "Sci-Fi / Cyberpunk & Dystopie",
    year: "2017",
    rating: "9.2",
    duration: "2h 44m",
    synopsis: "Trente ans après les événements du premier film, l'officier K, un blade runner du LAPD, met au jour un secret enfoui depuis des décennies capable de faire basculer le restant de la société dans un chaos absolu.",
    image: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/gNdLJU9TxrpGx4dkZidjys3fyy0.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    license: "Alcon Entertainment / Warner Bros.",
  },

  // ==========================================
  // 📺 SÉRIES LIVE-ACTION (AVEC DOSSIERS DE SAISONS)
  // ==========================================
  {
    id: "the-last-of-us",
    title: "The Last of Us",
    category: "serie",
    genre: "Drame Post-Apocalyptique / Survie",
    year: "2023",
    rating: "9.5",
    duration: "Saison 1 • 9 ép.",
    synopsis: "Vingt ans après qu'une pandémie fongique a anéanti la société moderne, Joel, un survivant endurci, est engagé pour faire évader Ellie, une jeune fille de 14 ans immunisée, hors d'une zone de quarantaine militaire oppressante.",
    image: "https://image.tmdb.org/t/p/w500/dmo6TYuuJgaYinXBPjrgG9mB5od.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/lY2DhbA7Hy44fAKddr06UrXWWaQ.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    license: "HBO Original / Sony Pictures Television",
    seasons: [
      {
        id: "tlou-s1",
        seasonNumber: 1,
        folderName: "📁 Dossier Saison 1 : La Traversée de l'Amérique",
        year: "2023",
        episodesCount: 9,
        episodes: [
          {
            id: "tlou-ep1",
            number: 1,
            title: "Quand tu es perdu dans les ténèbres",
            duration: "81m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w500/dmo6TYuuJgaYinXBPjrgG9mB5od.jpg",
            synopsis: "L'éclosion du Cordyceps en 2003 brise la vie de Joel. Vingt ans plus tard, il accepte la mission de convoyer Ellie.",
          },
          {
            id: "tlou-ep3",
            number: 3,
            title: "Longtemps...",
            duration: "75m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w1280/lY2DhbA7Hy44fAKddr06UrXWWaQ.jpg",
            synopsis: "L'histoire poignante et bouleversante de Bill et Frank au cœur de leur ville fortifiée.",
          },
        ],
      },
    ],
  },
  {
    id: "stranger-things",
    title: "Stranger Things",
    category: "serie",
    genre: "Mystère / Sci-Fi Années 80",
    year: "2024",
    rating: "9.2",
    duration: "4 Saisons • 34 ép.",
    synopsis: "Dans la petite ville d'Hawkins en Indiana durant les années 1980, la disparition mystérieuse d'un jeune garçon entraîne ses amis dans une enquête périlleuse impliquant des expériences secrètes du gouvernement, un Monde à l'Envers et une fille aux dons télékinétiques.",
    image: "https://image.tmdb.org/t/p/w500/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/9P4IIMYY3HifqeruZq0ZZ9g7YUi.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    license: "21 Laps Entertainment / Netflix",
    seasons: [
      {
        id: "st-s1",
        seasonNumber: 1,
        folderName: "📁 Dossier Saison 1 : La Disparition de Will Byers",
        year: "2016",
        episodesCount: 8,
        episodes: [
          {
            id: "st-ep1",
            number: 1,
            title: "La Disparition de Will",
            duration: "48m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w500/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg",
            synopsis: "En rentrant chez lui à vélo après une partie de Donjons & Dragons, Will aperçoit une créature terrifiante et disparaît sans laisser de trace.",
          },
        ],
      },
      {
        id: "st-s4",
        seasonNumber: 4,
        folderName: "📁 Dossier Saison 4 : La Malédiction de Vecna",
        year: "2022",
        episodesCount: 9,
        episodes: [
          {
            id: "st4-ep1",
            number: 1,
            title: "Le Club des Damnés",
            duration: "76m",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            thumbnail: "https://image.tmdb.org/t/p/w1280/9P4IIMYY3HifqeruZq0ZZ9g7YUi.jpg",
            synopsis: "Le Hellfire Club s'affronte dans une partie décisive tandis qu'un monstre psychique commence à frapper les lycéens d'Hawkins.",
          },
        ],
      },
    ],
  },
];

// Presets d'images vérifiées pour l'upload dans le panneau Admin
export const PRESET_ARTWORK = [
  {
    label: "⚔️ [Anime] Solo Leveling: Arise",
    category: "anime" as MediaCategory,
    poster: "https://image.tmdb.org/t/p/w500/geCRueV3ElhRTr0xtJuEWJt6dJ1.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/xMNH87maNLt9n2bMDYeI6db5VFm.jpg",
  },
  {
    label: "⚔️ [Anime] Jujutsu Kaisen",
    category: "anime" as MediaCategory,
    poster: "https://image.tmdb.org/t/p/w500/6qQzMJG27XOJsyAEEIisoJB45j2.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/qpin8cASXEVtwhzNsprHYFiOAGk.jpg",
  },
  {
    label: "⚔️ [Anime] Demon Slayer: Kimetsu no Yaiba",
    category: "anime" as MediaCategory,
    poster: "https://image.tmdb.org/t/p/w500/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/3GQKYh6Trm8pxd2AypovoYQf4Ay.jpg",
  },
  {
    label: "⚔️ [Anime] L'Attaque des Titans",
    category: "anime" as MediaCategory,
    poster: "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/rqbCbjB19amtOtFQbb3K2lgm2zv.jpg",
  },
  {
    label: "⚔️ [Anime] Re:Zero — Starting Life in Another World",
    category: "anime" as MediaCategory,
    poster: "https://image.tmdb.org/t/p/w500/oHqYrPAsIiTD5m4DuxumV4er8BU.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/7ZruEnSnHD6Jx5mF0hBt1E306Vt.jpg",
  },
  {
    label: "⚔️ [Anime] Frieren: Beyond Journey's End",
    category: "anime" as MediaCategory,
    poster: "https://image.tmdb.org/t/p/w500/dqZENchTd7lp5zht7BdlqM7RBhD.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/rBOnrVlck7BIlGeWVlzYiZeg4l2.jpg",
  },
  {
    label: "⚔️ [Anime] One Piece: Egghead",
    category: "anime" as MediaCategory,
    poster: "https://image.tmdb.org/t/p/w500/dB4EDhre2dsC2kxYDavyKWqLQwi.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/v38qp4bySLTXYu3MF8r5GD51FN3.jpg",
  },
  {
    label: "🎬 [Film Réel] Dune: Deuxième Partie",
    category: "film" as MediaCategory,
    poster: "https://image.tmdb.org/t/p/w500/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/eZ239CUp1d6OryZEBPnO2n87gMG.jpg",
  },
  {
    label: "🎬 [Film Réel] Oppenheimer",
    category: "film" as MediaCategory,
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/neeNHeXjMF5fXoCJRsOmkNGC7q.jpg",
  },
  {
    label: "🎬 [Film Réel] Interstellar",
    category: "film" as MediaCategory,
    poster: "https://image.tmdb.org/t/p/w500/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/8sNiAPPYU14PUepFNeSNGUTiHW.jpg",
  },
  {
    label: "🎬 [Film Réel] Gladiator II",
    category: "film" as MediaCategory,
    poster: "https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/tOqIwliWMovSIZ9DyvHcHI7p2im.jpg",
  },
  {
    label: "🎬 [Film Réel] Spider-Man: Across the Spider-Verse",
    category: "film" as MediaCategory,
    poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/kVd3a9YeLGkoeR50jGEXM6EqseS.jpg",
  },
  {
    label: "🎬 [Film Réel] Deadpool & Wolverine",
    category: "film" as MediaCategory,
    poster: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/by8z9Fe8y7p4jo2YlW2SZDnptyT.jpg",
  },
  {
    label: "🎬 [Film Réel] The Batman",
    category: "film" as MediaCategory,
    poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/rvtdN5XkWAfGX6xDuPL6yYS2seK.jpg",
  },
  {
    label: "🎬 [Film Réel] Blade Runner 2049",
    category: "film" as MediaCategory,
    poster: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/gNdLJU9TxrpGx4dkZidjys3fyy0.jpg",
  },
  {
    label: "📺 [Série Réelle] The Last of Us",
    category: "serie" as MediaCategory,
    poster: "https://image.tmdb.org/t/p/w500/dmo6TYuuJgaYinXBPjrgG9mB5od.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/lY2DhbA7Hy44fAKddr06UrXWWaQ.jpg",
  },
  {
    label: "📺 [Série Réelle] Stranger Things",
    category: "serie" as MediaCategory,
    poster: "https://image.tmdb.org/t/p/w500/uOOtwVbSr4QDjAGIifLDwpb2Pdl.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/9P4IIMYY3HifqeruZq0ZZ9g7YUi.jpg",
  },
];

const STORAGE_KEY = "cinewheel_catalog_v2";

/**
 * Récupère le catalogue combiné (Catalogue par défaut + Films/Animes ajoutés ou modifiés)
 */
export function getStoredCatalog(): MediaItem[] {
  if (typeof window === "undefined") {
    return INITIAL_CATALOG;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CATALOG));
      return INITIAL_CATALOG;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_CATALOG;
  } catch (err) {
    console.error("Erreur lors de la lecture du catalogue localStorage:", err);
    return INITIAL_CATALOG;
  }
}

/**
 * Sauvegarde ou met à jour un élément (film, anime ou série)
 */
export function saveMediaItem(item: MediaItem): MediaItem[] {
  if (typeof window === "undefined") return INITIAL_CATALOG;
  const current = getStoredCatalog();
  const index = current.findIndex((i) => i.id === item.id);
  let updated: MediaItem[];
  if (index >= 0) {
    updated = current.map((i) => (i.id === item.id ? item : i));
  } else {
    updated = [item, ...current];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  // Déclenche un événement de synchronisation locale
  window.dispatchEvent(new Event("cinewheel_catalog_updated"));
  return updated;
}

/**
 * Supprime un élément par son ID
 */
export function deleteMediaItem(id: string): MediaItem[] {
  if (typeof window === "undefined") return INITIAL_CATALOG;
  const current = getStoredCatalog();
  const updated = current.filter((i) => i.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("cinewheel_catalog_updated"));
  return updated;
}

/**
 * Réinitialise aux données officielles
 */
export function resetCatalogToDefault(): MediaItem[] {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CATALOG));
    window.dispatchEvent(new Event("cinewheel_catalog_updated"));
  }
  return INITIAL_CATALOG;
}
