export interface IData<T> {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
  data?: T;
}
