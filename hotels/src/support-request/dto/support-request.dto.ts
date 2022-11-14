import { Schema as MongooseSchema } from 'mongoose';

type ID = MongooseSchema.Types.ObjectId;

export interface CreateSupportRequestDto {
  user: ID;
  text: string;
}

export class CreateSupportReqDto implements CreateSupportRequestDto {
  user: ID;
  text: string;
}

export interface SendMessageDto {
  author: ID;
  supportRequest: ID;
  text: string;
}

export class SendMsgDto implements SendMessageDto {
  author: ID;
  supportRequest: ID;
  text: string;
}

export interface MarkMessagesAsReadDto {
  user: ID;
  supportRequest: ID;
  createdBefore: Date;
}

export class MarkAsReadMessagesDto implements MarkMessagesAsReadDto {
  user: ID;
  supportRequest: ID;
  createdBefore: Date;
}

export interface GetChatListParams {
  user?: ID | string;
  isActive: boolean;
}

export class FindSupportRequestsDto implements GetChatListParams {
  user?: ID | string;
  isActive: boolean;
  limit: number;
  offset: number;
}
