export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export class ResponseUtil {
  static success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      ...(message && { message }),
    };
  }

  static successWithPagination<T>(
    items: T[],
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    },
    message?: string,
  ): ApiResponse<{ items: T[]; pagination: typeof pagination }> {
    return {
      success: true,
      data: {
        items,
        pagination,
      },
      ...(message && { message }),
    };
  }

  static successWithMessage(message: string): ApiResponse {
    return {
      success: true,
      message,
    };
  }
}
