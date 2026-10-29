import { NextResponse } from "next/server";
import { testSebpayConnectivity } from "@/lib/sebpay";

export async function GET() {
  const result = await testSebpayConnectivity();
  return NextResponse.json({
    ...result,
    currentIp: "143.105.152.209",
    publicKeyConfigured: !!process.env.NEXT_PUBLIC_SEBPAY_PUBLIC_KEY,
    secretKeyConfigured: !!process.env.SEBPAY_SECRET_KEY,
  });
}
