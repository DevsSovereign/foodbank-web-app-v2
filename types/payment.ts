/** Payment / wallet-funding types. */

/**
 * Where the temporary account is generated:
 * - `backend`  — our own API talks to the provider (secret stays server-side).
 * - `paystack` — the browser calls Paystack directly with a secret key.
 */
export type PaymentMode = "backend" | "paystack";

/** Normalized bank-transfer account shown to the user. */
export interface BankTransferAccount {
  accountNumber: string;
  bankName: string;
  accountName: string;
  fee: number;
  expiresAt?: string;
  reference?: string;
}

export interface CreateBankTransferPayload {
  amount: number;
  email: string;
  mode?: PaymentMode;
  metadata?: Record<string, unknown>;
}

export interface VerifyBankTransferPayload {
  userId: string;
  reference: string;
}

/** Raw shape returned by Paystack's `POST /charge` (bank_transfer). */
export interface PaystackChargeData {
  account_number?: string;
  account_name?: string;
  bank?: { name?: string };
  account_expires_at?: string;
  reference?: string;
}

export interface PaystackChargeResponse {
  status: boolean;
  message: string;
  data: PaystackChargeData;
}

/** Loose shape of our backend's `/payments/bank-transfer` `data` field. */
export interface BackendBankTransferData {
  accountNumber?: string;
  account_number?: string;
  accountName?: string;
  account_name?: string;
  bankName?: string;
  bank?: { name?: string };
  fee?: number;
  expiresAt?: string;
  account_expires_at?: string;
  reference?: string;
  tx_ref?: string;
  ref?: string;
}
