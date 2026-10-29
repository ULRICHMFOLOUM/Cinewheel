import { NextResponse } from "next/server";
import { getSebpayTransactionStatus } from "@/lib/sebpay";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference") || searchParams.get("id");

  if (!reference) {
    return NextResponse.json(
      { success: false, message: "Référence ou ID manquant." },
      { status: 400 }
    );
  }

  const result = await getSebpayTransactionStatus(reference);
  return NextResponse.json(result);
}
