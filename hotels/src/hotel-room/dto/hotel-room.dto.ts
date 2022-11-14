import { Schema as MongooseSchema } from 'mongoose';

export interface SearchRoomsParams {
  limit: number;
  offset: number;
  hotel: string;
  isEnabled?: boolean;
}

export class SearchHotelRoomsDto implements SearchRoomsParams {
  limit: number;
  offset: number;
  hotel: string;
  isEnabled?: true;
}

interface ICreateHotelRoomDto {
  hotel: MongooseSchema.Types.ObjectId | string;
  description: string;
  images: string[];
  isEnabled: boolean;
}

export class CreateHotelRoomDto implements ICreateHotelRoomDto {
  hotel: MongooseSchema.Types.ObjectId | string;
  description: string;
  images: string[] = [];
  isEnabled = true;
}
