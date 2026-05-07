/**
 * Generic API response wrapper.
 *
 * The backend returns `{ message }` on errors and typically
 * `{ message, data }` on success. This type covers both shapes.
 */
export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
}

/** Paginated list envelope (shape TBD — will adjust when we see a real paginated response). */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Typed error thrown by the API client.
 * Components can `catch (e)` and check `e instanceof ApiError`.
 */
export class ApiError extends Error {
  /** HTTP status code returned by the server. */
  status: number;
  /** Raw error payload from the backend (may contain field-level errors). */
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}
