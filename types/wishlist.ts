import type { ApiResponse } from "./api";

// ---------------------------------------------------------------------------
// Wishlist Item — shape returned by GET /getWishlistItems
// ---------------------------------------------------------------------------

/** Individual wishlist item as returned by the backend. */
export interface WishlistItemDto {
  /** Unique wishlist-item ID (some envs use `_id`). */
  id?: string;
  _id?: string;
  /** Associated product ID (some envs use `packageId`). */
  productId?: string;
  packageId?: string;
  /** Product name / title (some envs use `name`). */
  productName?: string;
  name?: string;
  /** Product category label (some envs use `type`). */
  category?: string;
  type?: string;
  /** Unit price (some envs only provide `totalPrice` + `quantity`). */
  price?: number;
  totalPrice?: number;
  /** Quantity (present in some envs). */
  quantity?: number;
  /** Whether the product is currently in stock (some envs use `isAvailable`). */
  inStock?: boolean;
  isAvailable?: boolean;
  /** Full URL or relative path to the product image */
  image?: string;
}

/** Envelope returned by GET /getWishlistItems */
export interface GetWishlistItemsResponse extends ApiResponse<WishlistItemDto[]> {
  data: WishlistItemDto[];
}

// ---------------------------------------------------------------------------
// UI-friendly mapped type
// ---------------------------------------------------------------------------

/** Wishlist item shaped for the UI layer. */
export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  image: string;
}

/** Map a backend DTO to the leaner UI model. */
export function toWishlistItem(dto: WishlistItemDto): WishlistItem {
  const anyDto = dto as unknown as Record<string, unknown>;
  const quantity =
    (anyDto.quantity as number | undefined) && Number.isFinite(anyDto.quantity as number)
      ? (anyDto.quantity as number)
      : 1;
  const totalPrice = anyDto.totalPrice as number | undefined;
  const unitPrice =
    typeof anyDto.price === "number"
      ? (anyDto.price as number)
      : typeof totalPrice === "number" && quantity > 0
        ? totalPrice / quantity
        : 0;
  return {
    id: (anyDto.id as string) ?? (anyDto._id as string) ?? "",
    productId: (anyDto.productId as string) ?? (anyDto.packageId as string) ?? "",
    name: (anyDto.productName as string) ?? (anyDto.name as string) ?? "",
    category: (anyDto.category as string) ?? (anyDto.type as string) ?? "",
    price: unitPrice,
    inStock: (anyDto.inStock as boolean) ?? (anyDto.isAvailable as boolean) ?? true,
    image: (anyDto.image as string) ?? "",
  };
}

// ---------------------------------------------------------------------------
// Delete Wishlist Item — DELETE /deleteWishlistItem
// ---------------------------------------------------------------------------

/** Payload sent to DELETE /deleteWishlistItem */
export interface DeleteWishlistItemRequest {
  itemId: string;
}

/** Response from DELETE /deleteWishlistItem */
export interface DeleteWishlistItemResponse extends ApiResponse {
  message: string;
}

// ---------------------------------------------------------------------------
// Add To Wishlist — POST /addToWishlist
// ---------------------------------------------------------------------------

/** Payload sent to POST /addToWishlist */
export interface AddToWishlistRequest {
  productId: string;
  quantity: number;
}

/** Response from POST /addToWishlist */
export interface AddToWishlistResponse extends ApiResponse {
  message: string;
}
