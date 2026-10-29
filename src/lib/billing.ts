/**
 * KAIJU STREAM - Moteur de Facturation & Plans d'Abonnement (FCFA / XAF)
 * Spécifiquement calibré pour l'Afrique centrale et de l'ouest (Orange Money, MTN MoMo, Moov, Wave via Sebpay Africa)
 */

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  price: number; // en FCFA
  durationHours: number;
  description: string;
  downloadsIncluded: number | "illimite";
  popular?: boolean;
}

export const PLANS_CATALOG: PricingPlan[] = [
  {
    id: "plan-flash",
    name: "Pass Flash (1 Film)",
    badge: "Découverte",
    price: 200,
    durationHours: 3,
    description: "Idéal pour regarder 1 long-métrage ou 4 épisodes d'anime sans interruption.",
    downloadsIncluded: 1,
  },
  {
    id: "plan-nuit",
    name: "Pass Nuit Éco",
    badge: "Spécial Forfaits Nuit MTN/Orange",
    price: 300,
    durationHours: 7, // 23h à 06h
    description: "Binge-watching et téléchargements illimités pendant les heures creuses (23h à 06h).",
    downloadsIncluded: "illimite",
    popular: true,
  },
  {
    id: "plan-24h",
    name: "Pass 24H Illimité",
    badge: "Le Plus Populaire",
    price: 500,
    durationHours: 24,
    description: "Accès total au catalogue et 5 téléchargements hors-ligne pendant 24 heures.",
    downloadsIncluded: 5,
    popular: true,
  },
  {
    id: "plan-hebdo",
    name: "Pass Semaine (7 Jours)",
    badge: "Binge-Watcher",
    price: 1500,
    durationHours: 168,
    description: "Regardez des saisons entières d'anime et blockbusters en toute liberté.",
    downloadsIncluded: 20,
  },
  {
    id: "plan-mensuel",
    name: "Abonnement VIP 30 Jours",
    badge: "Meilleure Valeur",
    price: 3500,
    durationHours: 720,
    description: "Accès illimité sans aucune restriction. Qualité Full HD + téléchargements illimités.",
    downloadsIncluded: "illimite",
  },
];

export const TARIFS = {
  PRIX_HEURE_STREAMING: 100, // FCFA par heure active
  FRAIS_PAR_TELECHARGEMENT: 50, // FCFA par téléchargement
  PLAFOND_MAX_FCFA: 1000, // FCFA max pour 24h illimitées
  ESSAI_GRATUIT_MINUTES: 15, // 15 minutes offertes sans inscription
} as const;

/**
 * Estimation de consommation données mobiles (en Mo)
 */
export function estimerConsommationMegas(dureeMinutes: number, qualite: "360p" | "480p" | "720p" | "1080p"): number {
  const debitMoParMinute = {
    "360p": 2.5, // ~150 Mo le film de 1h
    "480p": 5.0, // ~300 Mo le film
    "720p": 12.0, // ~720 Mo le film
    "1080p": 25.0, // ~1.5 Go le film
  };
  return Math.round(dureeMinutes * debitMoParMinute[qualite]);
}

/**
 * Calcule le montant total théorique et le montant plafonné en FCFA
 */
export function calculerMontantTotal(heures: number, telechargements: number) {
  const h = Math.max(0, heures);
  const t = Math.max(0, telechargements);

  const brut = Math.round(h * TARIFS.PRIX_HEURE_STREAMING + t * TARIFS.FRAIS_PAR_TELECHARGEMENT);
  const plafonne = Math.min(TARIFS.PLAFOND_MAX_FCFA, brut);
  const plafondAtteint = brut >= TARIFS.PLAFOND_MAX_FCFA;
  const economie = Math.max(0, brut - plafonne);

  return {
    montantBrut: brut,
    montantPlafonne: plafonne,
    plafondAtteint,
    economieRealisee: economie,
  };
}

/**
 * Calcule le coût marginal d'un nouveau téléchargement (50 FCFA ou le reliquat jusqu'au plafond)
 */
export function calculerCoutTelechargement(montantActuelCumule: number) {
  const montantValide = Math.max(0, Math.min(TARIFS.PLAFOND_MAX_FCFA, montantActuelCumule));
  const reliquat = TARIFS.PLAFOND_MAX_FCFA - montantValide;

  if (reliquat <= 0) {
    return {
      cout: 0,
      gratuitParPlafond: true,
      nouveauCumul: TARIFS.PLAFOND_MAX_FCFA,
    };
  }

  const cout = Math.min(TARIFS.FRAIS_PAR_TELECHARGEMENT, reliquat);
  const nouveauCumul = Math.min(TARIFS.PLAFOND_MAX_FCFA, montantValide + cout);

  return {
    cout,
    gratuitParPlafond: cout === 0,
    nouveauCumul,
  };
}
