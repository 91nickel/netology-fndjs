import { Schema as MongooseSchema } from "mongoose";

export class CreateHotelRoomDto {
    hotel: MongooseSchema.Types.ObjectId
    title: string
    description: string
    images: string[] = []
    isEnabled: boolean = true
}