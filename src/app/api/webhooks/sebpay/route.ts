import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    let eventData: any = {};
    try {
      eventData = JSON.parse(rawBody);
    } catch {
      eventData = { raw: rawBody };
    }

    console.log("[SEBPAY WEBHOOK RECEIVED]:", JSON.stringify(eventData, null, 2));

    const status = eventData?.status || eventData?.event || "unknown";
    const reference = eventData?.reference || eventData?.transaction_id || eventData?.data?.reference;

    // Traitement de l'événement (ex: payment.succeeded / COMPLETED)
    if (
      status === "payment.succeeded" ||
      status === "COMPLETED" ||
      status === "SUCCESSFUL" ||
      status === "success"
    ) {
      console.log(`[SEBPAY] Paiement validé pour la référence ${reference}`);
    }

    return NextResponse.json({
      received: true,
      timestamp: new Date().toISOString(),
      reference,
      status,
    });
  } catch (error: any) {
    console.error("[SEBPAY WEBHOOK ERROR]:", error);
    return NextResponse.json(
      { received: false, error: error?.message },
      { status: 500 }
    );
  }
}
