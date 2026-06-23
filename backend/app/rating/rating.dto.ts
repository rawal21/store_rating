import { BaseDto } from "@/common/dio/base.dto";

export interface IRating extends BaseDto {
  value: number;
  userId: string;
  storeId: string;
}

export interface IRatingCreate {
  value: number;
  userId: string;
  storeId: string;
}

export interface IRatingUpdate {
  value: number;
}

export interface IRatingResponse extends BaseDto {
  value: number;
  userId: string;
  storeId: string;
  userName?: string;
  storeName?: string;
}

export interface IStoreRatingSummary {
  storeId: string;
  averageRating: number;
  totalRatings: number;
}