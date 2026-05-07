import { apiClient } from "@/lib/api-client";
import type { GetCategoriesResponse } from "@/types/category";

/**
 * Service layer for product category operations.
 *
 * All methods return typed promises and delegate HTTP work to `apiClient`,
 * which automatically attaches the Bearer token and handles error mapping.
 */
export const categoryService = {
  /**
   * Fetch all product categories (types).
   *
   * Endpoint: **GET /getAllProductType?limit=50**
   *
   * Uses a high limit to fetch all categories in a single request.
   */
  getCategories(): Promise<GetCategoriesResponse> {
    return apiClient.get<GetCategoriesResponse>("/getAllProductType?limit=50");
  },
};
