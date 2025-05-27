export interface PageResponse<T> {
    totalPages: number;
    currentPage: number;
    pageSize: number;
    totalElements: number;
    data: T[];
  }
  