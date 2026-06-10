import type { ApiResponse } from "./api";
import { GamificationRewardType, UserResponse } from "./user";

// ---------------------------------------------------------------------------
// Cart Item — shape returned by GET /getCartItems
// ---------------------------------------------------------------------------

/** Individual cart item as returned by the backend. */
export interface CartItemDto {
  [key: string]: unknown;

  /** Unique cart-item (line) ID (some envs use `_id`). */
  id?: string;
  _id?: string;
  /** Associated product/package ID (some envs use `packageId`). */
  productId?: string;
  packageId?: string;
  /** Product name / title (some envs use `name`). */
  productName?: string;
  name?: string;
  /** Unit price at the time of adding to cart */
  price?: number;
  /** Unit price provided by backend in some envs */
  pricePerQuantity?: number;
  /** Total line price in some envs */
  totalPrice?: number;
  /** Category/type label (some envs use `type`). */
  type?: string;
  /** Measurement string, e.g. "5kg" */
  measurement?: string;
  /** Quantity in the cart */
  quantity?: number;
  /** Full URL or relative path to the product image */
  image?: string;
  /** Tag label, e.g. "NEW FOOD", "BEST SELLER" */
  tag?: string;
}

/** Envelope returned by GET /getCartItems */
export interface GetCartItemsResponse extends ApiResponse<CartItemDto[]> {
  data: CartItemDto[];
}

// ---------------------------------------------------------------------------
// UI-friendly mapped type (minimal transform for rendering)
// ---------------------------------------------------------------------------

/** Cart item shaped for the UI layer. */
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  tag: string;
}

/** Map a backend DTO to the leaner UI model. */
export function toCartItem(dto: CartItemDto): CartItem {
  const anyDto = dto as unknown as Record<string, unknown>;
  const quantity =
    (anyDto.quantity as number | undefined) && Number.isFinite(anyDto.quantity as number)
      ? (anyDto.quantity as number)
      : 1;
  const totalPrice = anyDto.totalPrice as number | undefined;
  const pricePerQuantity = anyDto.pricePerQuantity as number | undefined;
  const unitPrice =
    typeof anyDto.price === "number"
      ? (anyDto.price as number)
      : typeof pricePerQuantity === "number"
        ? pricePerQuantity
        : typeof totalPrice === "number" && quantity > 0
          ? totalPrice / quantity
          : 0;
  return {
    id: (anyDto.id as string) ?? (anyDto._id as string) ?? "",
    productId: (anyDto.productId as string) ?? (anyDto.packageId as string) ?? "",
    name: (anyDto.productName as string) ?? (anyDto.name as string) ?? "",
    price: unitPrice,
    quantity,
    image: (anyDto.image as string) ?? "",
    tag: (anyDto.tag as string) ?? "",
  };
}

// ---------------------------------------------------------------------------
// Delete Cart Item — DELETE /v1/api/deleteCartItem
// ---------------------------------------------------------------------------

/** Payload sent to DELETE /deleteCartItem */
export interface DeleteCartItemRequest {
  itemId: string;
}

/** Response from DELETE /deleteCartItem */
export interface DeleteCartItemResponse extends ApiResponse {
  message: string;
}

// ---------------------------------------------------------------------------
// Add To Cart — POST /addToCart
// ---------------------------------------------------------------------------

/** Payload sent to POST /addToCart */
export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

/** Response from POST /addToCart */
export interface AddToCartResponse extends ApiResponse {
  message: string;
}

export interface UserFirstOrder {
  hasOrderedBefore: boolean;
  lastOrderDate: string;
  lastOrderId: string;
  message: string;
}

export interface CreateOrderPayload {
  deliveryDetails: string;
  deliveryFee: number;
  serviceFee: number;
  deliveryContact: string;
  deliveryDateOption: string;
  orderType: UserResponse["accountType"];
  topUpAmount: number;
  gamified: {
    rewardId: string;
    rewardType: GamificationRewardType;
  }[];
}

export interface ApplicableFees {
  createdAt: string;
  deliveryFee: number;
  increment: number;
  interest: number;
  isFreeDeliveryOnFirstOrder: boolean;
  serviceFee: number;
  stateLocation: string;
  updatedAt: string;
  _id: string;
}
