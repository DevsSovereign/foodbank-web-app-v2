/** Payload sent to POST /users/register */
export interface RegisterRequest {
  email: string;
  phoneNumber: string;
  password: string;
  /** Optional referral / account-officer code. */
  accountOfficerCode?: string;
}

/**
 * Shape returned on successful registration.
 * TODO: Update once the actual success response is confirmed.
 */
export interface RegisterResponse {
  message: string;
  data?: {
    id?: string;
    email?: string;
    phoneNumber?: string;
  };
}

/** Payload sent to POST /users/login */
export interface LoginRequest {
  /** Email or phone number — the backend accepts either. */
  identifier: string;
  password: string;
}

/** Shape returned on successful login. */
export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    phoneNumber: string;
    employmentStatus: string;
    accountType: string;
    isComplete: string;
    adminVerification: string;
    isApproved: boolean;
    isEmailVerified: boolean;
  };
}

/** Payload sent to POST /users/email/send-otp */
export interface SendOtpRequest {
  email: string;
}

/** Payload sent to POST /users/email/verify-otp */
export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

/** Generic response for OTP endpoints. */
export interface OtpResponse {
  message: string;
}
