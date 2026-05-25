import { apiClient } from "@/lib/api-client";
import type {
  GetCartItemsResponse,
  AddToCartRequest,
  AddToCartResponse,
  DeleteCartItemRequest,
  DeleteCartItemResponse,
  UserFirstOrder,
  ApplicableFees,
  CreateOrderPayload,
} from "@/types/cart";

/**
 * Service layer for cart operations.
 *
 * All methods return typed promises and delegate HTTP work to `apiClient`,
 * which automatically attaches the Bearer token and handles error mapping.
 */
export const cartService = {
  /**
   * Fetch every item currently in the authenticated user's cart.
   *
   * Endpoint: **GET /getCartItems**
   */
  async getCartItems(): Promise<GetCartItemsResponse> {
    const res = await apiClient.get<unknown>("/getCartItems");

    // Backend sometimes returns a raw array instead of `{ message, data }`.
    if (Array.isArray(res)) {
      return { message: "Success", data: res as GetCartItemsResponse["data"] };
    }

    // Some environments return `{ items: [...] }`.
    if (
      typeof res === "object" &&
      res !== null &&
      "items" in res &&
      Array.isArray((res as { items?: unknown }).items)
    ) {
      return {
        message: "Success",
        data: (res as { items: GetCartItemsResponse["data"] }).items,
      };
    }

    return res as GetCartItemsResponse;
  },

  /**
   * Remove a single item from the authenticated user's cart.
   *
   * Endpoint: **DELETE /v1/api/deleteCartItem**
   * Body: `{ itemId: string }`
   */
  deleteCartItem(data: DeleteCartItemRequest): Promise<DeleteCartItemResponse> {
    return apiClient.del<DeleteCartItemResponse>("/deleteCartItem", data);
  },

  /**
   * Add a product to the authenticated user's cart (or update its quantity).
   *
   * Endpoint: **POST /addToCart**
   * Note: Backend expects params as query string.
   * Query: `?productId=...&quantity=...`
   */
  addToCart(data: AddToCartRequest): Promise<AddToCartResponse> {
    const qs = new URLSearchParams({
      productId: data.productId,
      quantity: String(data.quantity),
    }).toString();
    // Send both query params and JSON body for compatibility with backend variants.
    return apiClient.post<AddToCartResponse>(`/addToCart?${qs}`, data);
  },

  async checkFirstOrder({ userId }: { userId: string }) {
    return await apiClient.get<UserFirstOrder>(`/checkUserHasOrder/${userId}`);
  },

  async getOrderPrices(): Promise<{ allfees: ApplicableFees[] }> {
    return await apiClient.get<{ allfees: ApplicableFees[] }>("/get-allFees");
  },

  async createOrder(payload: CreateOrderPayload) {
    return await apiClient.post("/create-order", payload);
  },

  async outrightSubtractFromWalletById(payload: { amountPay: number }) {
     return await apiClient.post("/OutrightSubtractFromWalletById", payload);
  },
};
