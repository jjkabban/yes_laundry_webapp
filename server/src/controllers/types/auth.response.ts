export interface ApiResponse<T> {
  message: string;
  success: boolean;
  data?: T;
  error?: { message: string; field: string }[] | null;
}
