export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationResult;
}

export class PaginationUtil {
  static calculateSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  static calculatePagination(
    page: number,
    limit: number,
    total: number
  ): PaginationResult {
    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  static paginate<T>(
    items: T[],
    page: number,
    limit: number,
    total: number
  ): PaginatedData<T> {
    return {
      items,
      pagination: this.calculatePagination(page, limit, total),
    };
  }
}
