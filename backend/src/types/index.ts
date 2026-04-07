import { Role } from "@prisma/client";

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  role: Role;
}

interface IMetaData {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface IData<T> {
  success: boolean;
  statusCode: number;
  message: string;
  meta?: IMetaData;
  data?: T;
}
