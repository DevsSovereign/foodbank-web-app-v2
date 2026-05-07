import { apiClient } from "@/lib/api-client";
import type { ProductDto } from "@/types/product";

/**
 * Service layer for product operations.
 *
 * All methods return typed promises and delegate HTTP work to `apiClient`,
 * which automatically attaches the Bearer token and handles error mapping.
 */
export const productService = {
  /**
   * Fetch every product in the catalogue.
   *
   * Endpoint: **GET /get-products**
   *
   * Note: The API returns a raw array (not wrapped in `{ data }`)
   */
  getProducts(): Promise<ProductDto[]> {
    return apiClient.get<ProductDto[]>("/get-products");
  },

  /**
   * Fetch a single product by its ID.
   *
   * Since there is no dedicated single-product endpoint, this fetches the
   * full catalogue and filters client-side.
   */
  async getProductById(id: string): Promise<ProductDto | null> {
    const products = await this.getProducts();
    return products.find((p) => p._id === id) ?? null;
  },
};
