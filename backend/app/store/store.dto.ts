import { BaseDto } from "@/common/dio/base.dto";

export interface IStore extends BaseDto {
  name: string;
  email: string;
  address: string;
  ownerId: string | null;
}

export interface IStoreCreate {
  name: string;
  email: string;
  address: string;
  ownerId?: string | null;
}

export interface IStoreUpdate {
  name?: string;
  email?: string;
  address?: string;
  ownerId?: string | null;
}

export interface IStoreResponse extends BaseDto {
  name: string;
  email: string;
  address: string;
  ownerId?: string | null;
  averageRating?: number;
  totalRatings?: number;
  userRating?: number | null;  // The authenticated user's own rating, if any
}
