import { NextResponse } from "next/server";
import { createSebpayCollection, createSebpayCheckoutSession } from "@/lib/sebpay";
import { PLANS_CATALOG } from "@/lib/billing";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { planId, amount, phone, operator, countryCode = "237", currency = "XAF", method = "direct" } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "Le numéro de téléphone est obligatoire." },
        { status: 400 }
      );
    }

    const plan = PLANS_CATALOG.find((p) => p.id === planId);
    const finalAmount = amount || plan?.price || 500;
    const planName = plan?.name || "Pass Streaming KAIJU STREAM";
    const reference = `CW_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const payload = {
      amount: finalAmount,
      currency: currency as "XAF" | "XOF",
      phone: phone,
      provider: (operator || "ORANGE").toUpperCase(),
      description: `Abonnement ${planName} (${finalAmount} FCFA)`,
      reference,
      metadata: {
        planId: planId || "plan-custom",
        planName,
        operator,
        phone,
      },
    };

    let result;
    if (method === "checkout") {
      result = await createSebpayCheckoutSession(payload);
    } else {
      result = await createSebpayCollection(payload);
    }

    // Gestion de l'IP non autorisée
    if (result.status === "ip_not_allowed") {
      return NextResponse.json(
        {
          success: false,
          code: "IP_NOT_ALLOWED",
          message: "L'adresse IP de votre serveur n'est pas encore autorisée dans Sebpay.",
          details:
            "Rendez-vous sur new.sebpay.bj > Paramètres Développeur > Adresses IP autorisées pour ajouter votre IP (ou désactiver la restriction IP pour les tests).",
          currentIp: "143.105.152.209",
          raw: result.raw,
        },
        { status: 403 }
      );
    }

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          code: result.errors?.code || "PAYMENT_FAILED",
          message: result.message || "Échec de l'initiation du paiement via Sebpay.",
          errors: result.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      status: result.status,
      transactionId: result.transaction_id,
      reference,
      checkoutUrl: result.checkout_url,
      message:
        result.message ||
        "Demande de paiement envoyée sur votre téléphone. Veuillez valider avec votre code secret Mobile Money.",
    });
  } catch (error: any) {
    console.error("Erreur route Sebpay:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur interne lors de la communication avec Sebpay.",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
