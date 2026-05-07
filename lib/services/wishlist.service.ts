import { apiClient } from "@/lib/api-client";
import type {
  GetWishlistItemsResponse,
  AddToWishlistRequest,
  AddToWishlistResponse,
  DeleteWishlistItemRequest,
  DeleteWishlistItemResponse,
} from "@/types/wishlist";

/**
 * Service layer for wishlist operations.
 *
 * All methods return typed promises and delegate HTTP work to `apiClient`,
 * which automatically attaches the Bearer token and handles error mapping.
 */
export const wishlistService = {
  /**
   * Fetch every item in the authenticated user's wishlist.
   *
   * Endpoint: **GET /getWishlistItems**
   */
  async getWishlistItems(): Promise<GetWishlistItemsResponse> {
    const res = await apiClient.get<unknown>("/getWishlistItems");

    // Backend sometimes returns a raw array instead of `{ message, data }`.
    if (Array.isArray(res)) {
      return { message: "Success", data: res as GetWishlistItemsResponse["data"] };
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
        data: (res as { items: GetWishlistItemsResponse["data"] }).items,
      };
    }

    return res as GetWishlistItemsResponse;
  },

  /**
   * Remove a single item from the authenticated user's wishlist.
   *
   * Endpoint: **DELETE /deleteWishlistItem**
   * Body: `{ itemId: string }`
   */
  deleteWishlistItem(data: DeleteWishlistItemRequest): Promise<DeleteWishlistItemResponse> {
    return apiClient.del<DeleteWishlistItemResponse>("/deleteWishlistItem", data);
  },

  /**
   * Add a product to the authenticated user's wishlist.
   *
   * Endpoint: **POST /addToWishlist**
   * Body: `{ productId: string; quantity: number }`
   */
  addToWishlist(data: AddToWishlistRequest): Promise<AddToWishlistResponse> {
    return apiClient.post<AddToWishlistResponse>("/addToWishlist", data);
  },
};
