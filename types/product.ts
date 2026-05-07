// ---------------------------------------------------------------------------
// Product — shape returned by GET /get-products
// ---------------------------------------------------------------------------

/** Discount information attached to a product. */
export interface ProductDiscount {
  isDiscount: boolean;
  /** Percentage off (present when `isDiscount` is true). */
  percentage?: number;
}

/** Warehouse the product is stocked in. */
export interface ProductWarehouse {
  location: string;
  storeName: string;
  warehouseId: string;
}

/** Location-specific price override. */
export interface ProductPriceTag {
  amount: number;
  location: string;
  _id: string;
}

/** Individual product as returned by the backend. */
export interface ProductDto {
  _id: string;
  name: string;
  /** Weight / size label, e.g. "5kg", "500g", "1Paint". */
  measurement: string;
  /** Category slug, e.g. "grains", "noodles", "oil", "groceries". */
  type: string;
  /** Base price in the product's default location. */
  price: number;
  /** Stock quantity available. */
  quantity: number;
  /** Primary product image URL (may be null). */
  image: string | null;
  /** Additional product images. */
  images: string[];
  description: string;
  /** Location-specific pricing overrides. */
  priceTag: ProductPriceTag[];
  /** Default location slug, e.g. "lagos", "oyo". */
  location: string;
  /** Product attribute label, e.g. "regular". */
  attribtes?: string;
  /** Number of units sold. */
  soldOut: number;
  /** Whether the product is currently available for purchase. */
  isAvailable: boolean;
  /** Associated product-type / category ID. */
  productTypeId?: string;
  discount: ProductDiscount;
  warehouse: ProductWarehouse;
  updatedAt?: string;
}

// ---------------------------------------------------------------------------
// UI-friendly mapped type
// ---------------------------------------------------------------------------

/** Product shaped for the UI layer. */
export interface Product {
  id: string;
  name: string;
  measurement: string;
  type: string;
  price: number;
  image: string | null;
  description: string;
  isAvailable: boolean;
  soldOut: number;
  discount: ProductDiscount;
}

/** Map a backend DTO to the leaner UI model. */
export function toProduct(dto: ProductDto): Product {
  return {
    id: dto._id,
    name: dto.name,
    measurement: dto.measurement,
    type: dto.type,
    price: dto.price,
    image: dto.image,
    description: dto.description,
    isAvailable: dto.isAvailable,
    soldOut: dto.soldOut,
    discount: dto.discount,
  };
}
