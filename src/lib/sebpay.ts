/**
 * SEBPAY AFRICA - Client d'orchestration de paiement Mobile Money & Cartes
 * Compatible Orange Money, MTN MoMo, Moov Money, Wave pour l'Afrique Centrale & Ouest.
 */

export interface SebpayCustomer {
  phone: string;
  name?: string;
  email?: string;
  provider?: "ORANGE" | "MTN" | "MOOV" | "WAVE" | string;
}

export interface SebpayCollectionPayload {
  amount: number;
  currency?: "XAF" | "XOF" | "USD" | "EUR";
  phone: string;
  provider: "ORANGE" | "MTN" | "MOOV" | "WAVE" | string;
  description?: string;
  reference?: string;
  callback_url?: string;
  return_url?: string;
  customer?: SebpayCustomer;
  metadata?: Record<string, any>;
}

export interface SebpayApiResponse<T = any> {
  success: boolean;
  message?: string;
  status?: string;
  transaction_id?: string;
  reference?: string;
  checkout_url?: string;
  errors?: {
    code?: string;
    details?: any;
  };
  data?: T;
  raw?: any;
}

const SEBPAY_API_URL = process.env.SEBPAY_API_URL || "https://api.sebpay.africa";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_SEBPAY_PUBLIC_KEY || "";
const SECRET_KEY = process.env.SEBPAY_SECRET_KEY || "";

/**
 * Nettoie et formate le numéro de téléphone pour le Cameroun (+237) ou l'Afrique
 */
export function formatPhoneNumber(phone: string, defaultCountryCode = "237"): string {
  const clean = phone.replace(/\D/g, "");
  // Si c'est un numéro à 9 chiffres (ex: 699001122 pour le Cameroun), on préfixe avec l'indicatif
  if (clean.length === 9 && (clean.startsWith("6") || clean.startsWith("2"))) {
    return `${defaultCountryCode}${clean}`;
  }
  return clean;
}

/**
 * En-têtes d'authentification Sebpay
 */
function getSebpayHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-Public-Key": PUBLIC_KEY,
    "X-Secret-Key": SECRET_KEY,
  };
}

/**
 * Initie un paiement Mobile Money (Push USSD) via Sebpay
 */
export async function createSebpayCollection(
  payload: SebpayCollectionPayload
): Promise<SebpayApiResponse> {
  const reference = payload.reference || `CW_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const formattedPhone = formatPhoneNumber(payload.phone);
  const operatorUpper = payload.provider.toUpperCase();

  const bodyData = {
    amount: payload.amount,
    currency: payload.currency || "XAF",
    phone: formattedPhone,
    provider: operatorUpper,
    customer: {
      phone: formattedPhone,
      provider: operatorUpper,
      name: payload.customer?.name || "Client Cinewheel",
      email: payload.customer?.email || "client@cinewheel.com",
    },
    reference,
    description: payload.description || `Paiement Pass KAIJU STREAM (${payload.amount} FCFA)`,
    callback_url: payload.callback_url || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhooks/sebpay`,
    return_url: payload.return_url || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/tarifs?reference=${reference}`,
    metadata: {
      ...payload.metadata,
      platform: "cinewheel",
      timestamp: new Date().toISOString(),
    },
  };

  try {
    const res = await fetch(`${SEBPAY_API_URL}/api/v1/collections`, {
      method: "POST",
      headers: getSebpayHeaders(),
      body: JSON.stringify(bodyData),
    });

    const data = await res.json().catch(() => null);

    if (res.status === 403 && data?.errors?.code === "IP_NOT_ALLOWED") {
      return {
        success: false,
        status: "ip_not_allowed",
        message: data.message || "Cette adresse IP n'est pas autorisée à utiliser cette clé API.",
        errors: {
          code: "IP_NOT_ALLOWED",
          details: "Ajoutez l'adresse IP de votre serveur dans votre tableau de bord Sebpay (Paramètres API > Adresses IP autorisées).",
        },
        raw: data,
      };
    }

    if (!res.ok) {
      return {
        success: false,
        status: "failed",
        message: data?.message || `Erreur Sebpay (${res.status})`,
        errors: data?.errors || { code: "HTTP_ERROR", status: res.status },
        raw: data,
      };
    }

    return {
      success: true,
      status: data?.status || "pending",
      transaction_id: data?.transaction_id || data?.id || reference,
      reference,
      checkout_url: data?.checkout_url || data?.payment_url,
      message: data?.message || "Demande de paiement envoyée. Veuillez valider sur votre mobile.",
      data,
    };
  } catch (err: any) {
    return {
      success: false,
      status: "error",
      message: err?.message || "Impossible de joindre la passerelle Sebpay.",
      errors: { code: "NETWORK_ERROR", details: err?.toString() },
    };
  }
}

/**
 * Crée une session de paiement hébergée (Checkout URL) via Sebpay
 */
export async function createSebpayCheckoutSession(
  payload: SebpayCollectionPayload
): Promise<SebpayApiResponse> {
  const reference = payload.reference || `CW_CHK_${Date.now()}`;
  const formattedPhone = formatPhoneNumber(payload.phone);

  const bodyData = {
    amount: payload.amount,
    currency: payload.currency || "XAF",
    phone: formattedPhone,
    provider: payload.provider.toUpperCase(),
    reference,
    description: payload.description || "Pass Streaming KAIJU STREAM",
    callback_url: payload.callback_url || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhooks/sebpay`,
    return_url: payload.return_url || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/tarifs?reference=${reference}`,
    customer: {
      phone: formattedPhone,
    },
  };

  try {
    const res = await fetch(`${SEBPAY_API_URL}/api/v1/checkout/sessions`, {
      method: "POST",
      headers: getSebpayHeaders(),
      body: JSON.stringify(bodyData),
    });

    const data = await res.json().catch(() => null);

    if (res.status === 403 && data?.errors?.code === "IP_NOT_ALLOWED") {
      return {
        success: false,
        status: "ip_not_allowed",
        message: data.message,
        errors: { code: "IP_NOT_ALLOWED" },
        raw: data,
      };
    }

    if (!res.ok) {
      return {
        success: false,
        status: "failed",
        message: data?.message || `Erreur Checkout Sebpay (${res.status})`,
        errors: data?.errors,
        raw: data,
      };
    }

    return {
      success: true,
      status: data?.status || "pending",
      transaction_id: data?.id || data?.session_id,
      checkout_url: data?.url || data?.checkout_url,
      reference,
      data,
    };
  } catch (err: any) {
    return {
      success: false,
      status: "error",
      message: err?.message || "Erreur de connexion à Sebpay Checkout.",
    };
  }
}

/**
 * Vérifie l'état d'une transaction Sebpay
 */
export async function getSebpayTransactionStatus(
  referenceOrId: string
): Promise<SebpayApiResponse> {
  try {
    const res = await fetch(`${SEBPAY_API_URL}/api/v1/collections/${referenceOrId}`, {
      method: "GET",
      headers: getSebpayHeaders(),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        status: "error",
        message: data?.message || `Statut Sebpay introuvable (${res.status})`,
        raw: data,
      };
    }

    return {
      success: true,
      status: data?.status || "pending",
      transaction_id: data?.id || referenceOrId,
      reference: data?.reference || referenceOrId,
      data,
    };
  } catch (err: any) {
    return {
      success: false,
      status: "error",
      message: err?.message || "Erreur lors de la vérification du paiement.",
    };
  }
}

/**
 * Teste la connectivité aux serveurs Sebpay avec les clés API configurées
 */
export async function testSebpayConnectivity(): Promise<{
  connected: boolean;
  ipWhitelisted: boolean;
  hasValidKeys: boolean;
  message: string;
  details?: any;
}> {
  try {
    const res = await fetch(`${SEBPAY_API_URL}/api/v1/collections`, {
      method: "POST",
      headers: getSebpayHeaders(),
      body: JSON.stringify({ amount: 100 }),
    });

    const data = await res.json().catch(() => null);

    if (res.status === 401) {
      return {
        connected: true,
        ipWhitelisted: false,
        hasValidKeys: false,
        message: "Clés API Sebpay invalides ou manquantes.",
        details: data,
      };
    }

    if (res.status === 403 && data?.errors?.code === "IP_NOT_ALLOWED") {
      return {
        connected: true,
        ipWhitelisted: false,
        hasValidKeys: true,
        message: "Clés valides reconnues, mais l'adresse IP actuelle doit être autorisée dans le Dashboard Sebpay.",
        details: data,
      };
    }

    return {
      connected: true,
      ipWhitelisted: true,
      hasValidKeys: true,
      message: "Passerelle Sebpay Live opérationnelle !",
      details: data,
    };
  } catch (err: any) {
    return {
      connected: false,
      ipWhitelisted: false,
      hasValidKeys: false,
      message: `Impossible de contacter Sebpay : ${err?.message}`,
    };
  }
}
