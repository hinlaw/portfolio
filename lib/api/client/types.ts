/** Success response: single resource */
export interface ApiResponse<T> {
  data: T;
}

/** Error response from API */
export interface ApiError {
  error: string;
  code?: string;
}

/** Pagination metadata */
export interface PageInfo {
  total: number;
  page: number;
  size: number;
}

/** Success response: paginated list */
export interface PaginatedResponse<T> {
  data: T[];
  page: PageInfo;
}
