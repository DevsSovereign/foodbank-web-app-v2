import { PAYSTACK_SECRET } from "@/lib/config";
import type { PaystackChargeResponse } from "@/types/payment";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

/**
 * Create a one-time bank-transfer charge directly against Paystack.
 *
 * SECURITY: this runs in the browser and reads `NEXT_PUBLIC_PAYSTACK_SECRET`.
 * Anything with a `NEXT_PUBLIC_` prefix is bundled into the client and is fully
 * visible to end users, so this exposes your Paystack SECRET key. Prefer the
 * `backend` mode (server holds the secret) for production. Kept here per request.
 */
export async function paystackCreateBankTransfer(payload: {
  email: string;
  amountKobo: number;
  expiresAtISO: string;
  metadata?: Record<string, unknown>;
}): Promise<PaystackChargeResponse> {
  const secret = PAYSTACK_SECRET;

  if (!secret) {
    throw new Error("Paystack secret key is missing in env (NEXT_PUBLIC_PAYSTACK_SECRET).");
  }

  const res = await fetch(`${PAYSTACK_BASE_URL}/charge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({
      email: payload.email,
      amount: String(payload.amountKobo),
      bank_transfer: {
        account_expires_at: payload.expiresAtISO,
      },
      metadata: payload.metadata ?? {},
    }),
  });

  const body = (await res.json().catch(() => null)) as PaystackChargeResponse | null;

  if (!res.ok || !body) {
    throw new Error(body?.message || "Failed to reach Paystack. Please try again.");
  }

  return body;
}
