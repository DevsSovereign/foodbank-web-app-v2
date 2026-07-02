import { apiClient } from "@/lib/api-client";
import { paystackCreateBankTransfer } from "./providers/paystack.service";
import type {
  BackendBankTransferData,
  BankTransferAccount,
  CreateBankTransferPayload,
  VerifyBankTransferPayload,
} from "@/types/payment";

/** Flat transaction fee (Naira) added on top of the amount the user sends. */
const FEE = 50;
/** How long a temporary (one-time) account stays valid. */
const TOTAL_TIME_SECONDS = 15 * 60;

const expiresAtISO = () => new Date(Date.now() + TOTAL_TIME_SECONDS * 1000).toISOString();

/**
 * Service layer for wallet-funding / payment operations.
 *
 * `apiClient` (backend mode) automatically attaches the Bearer token and maps
 * errors to `ApiError`. Paystack mode calls the provider directly from the
 * browser — see the security note in `providers/paystack.service.ts`.
 */
export const paymentService = {
  /**
   * Generate a temporary bank-transfer account for a single payment.
   *
   * - `paystack` → `POST https://api.paystack.co/charge`
   * - `backend`  → `POST /payments/bank-transfer`
   */
  async createBankTransferAccount(
    payload: CreateBankTransferPayload,
  ): Promise<BankTransferAccount> {
    const mode = payload.mode ?? "backend";
    const amountToReceive = payload.amount + FEE;

    if (mode === "paystack") {
      const res = await paystackCreateBankTransfer({
        email: payload.email,
        amountKobo: amountToReceive * 100,
        expiresAtISO: expiresAtISO(),
        metadata: payload.metadata,
      });

      if (!res?.status) {
        throw new Error(res?.message || "Failed to generate Paystack account");
      }

      const d = res.data;

      return {
        accountNumber: d?.account_number ?? "",
        bankName: d?.bank?.name ?? "",
        accountName: d?.account_name ?? "",
        fee: FEE,
        expiresAt: d?.account_expires_at,
        reference: d?.reference,
      };
    }

    // Backend mode: our API talks to the provider and keeps the secret server-side.
    const res = await apiClient.post<{ data?: BackendBankTransferData }>("/payments/bank-transfer", {
      amount: payload.amount,
      email: payload.email,
      expiresInSeconds: TOTAL_TIME_SECONDS,
      fee: FEE,
      metadata: payload.metadata ?? {},
    });

    const d = res?.data;

    return {
      accountNumber: d?.accountNumber ?? d?.account_number ?? "",
      bankName: d?.bankName ?? d?.bank?.name ?? "",
      accountName: d?.accountName ?? d?.account_name ?? "",
      fee: d?.fee ?? FEE,
      expiresAt: d?.expiresAt ?? d?.account_expires_at,
      reference: d?.reference ?? d?.tx_ref ?? d?.ref,
    };
  },

  /**
   * Confirm a bank transfer once the user says they've paid.
   *
   * Endpoint: **GET /checkAddFundStatus?userId=...&tx_ref=...**
   */
  verifyBankTransfer(payload: VerifyBankTransferPayload) {
    const qs = new URLSearchParams({
      userId: payload.userId,
      tx_ref: payload.reference,
    }).toString();

    return apiClient.get(`/checkAddFundStatus?${qs}`, {
      headers: { "x-no-loader": "1" },
    });
  },
};
