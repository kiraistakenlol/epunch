export class ApiResponse<T> {
  constructor(
    public readonly data: T | null,
    public readonly error: string | null = null,
  ) {}

  static success<T>(data: T): ApiResponse<T> {
    return new ApiResponse(data, null);
  }

  static error<T>(error: string): ApiResponse<T | undefined> {
    return new ApiResponse(undefined, error);
  }
} 