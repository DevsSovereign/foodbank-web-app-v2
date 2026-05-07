import { apiClient } from "@/lib/api-client";
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  SendOtpRequest,
  VerifyOtpRequest,
  OtpResponse,
} from "@/types/auth";

export const authService = {
  register(data: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>("/users/register", data);
  },

  login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("/users/login", data);
  },

  sendOtp(data: SendOtpRequest): Promise<OtpResponse> {
    return apiClient.post<OtpResponse>("/users/email/send-otp", data);
  },

  verifyOtp(data: VerifyOtpRequest): Promise<OtpResponse> {
    return apiClient.post<OtpResponse>("/users/email/verify-otp", data);
  },
};
