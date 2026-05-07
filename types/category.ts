// ---------------------------------------------------------------------------
// Product Category — shape returned by GET /getAllProductType
// ---------------------------------------------------------------------------

/** Individual product category as returned by the backend. */
export interface CategoryDto {
  _id: string;
  /** Category name / label, e.g. "grains", "noodles", "oil". */
  type: string;
  /** URL to the category image. */
  image: string;
  updatedAt?: string;
  createdAt?: string;
}

/** Paginated response envelope from GET /getAllProductType. */
export interface GetCategoriesResponse {
  data: CategoryDto[];
  nextCursor: string;
  isNextPage: boolean;
  count: number;
}
