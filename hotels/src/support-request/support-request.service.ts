import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Model, Schema as MongooseSchema } from 'mongoose';
import {
  SupportRequest,
  SupportRequestDocument,
} from './schema/support-request.schema';
import { Message, MessageDocument } from './schema/message.schema';
import {
  SendMsgDto,
  FindSupportRequestsDto,
  GetChatListParams,
  SendMessageDto,
} from './dto/support-request.dto';

type ID = string | MongooseSchema.Types.ObjectId;

interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;

  sendMessage(data: SendMessageDto): Promise<MessageDocument>;

  getMessages(supportRequest: ID): Promise<MessageDocument[]>;

  subscribe(
    handler: (
      supportRequest: SupportRequestDocument,
      message: MessageDocument,
    ) => void,
  ): () => void;
}

@Injectable()
export class SupportRequestService implements ISupportRequestService {
  @InjectModel(SupportRequest.name)
  private supportRequestModel: Model<SupportRequestDocument>;

  @InjectModel(Message.name)
  private messageModel: Model<MessageDocument>;

  constructor(private eventEmitter: EventEmitter2) {}

  findSupportRequests(
    dto: FindSupportRequestsDto,
  ): Promise<SupportRequestDocument[]> {
    const filter: any = {};
    if (dto.user) filter.user = dto.user;
    if (Object.keys(dto).includes('isActive')) filter.isActive = dto.isActive;
    try {
      return this.supportRequestModel
        .find(filter)
        .limit(dto.limit)
        .skip(dto.offset)
        .exec();
    } catch (error) {
      console.error(error);
    }
  }

  async sendMessage(dto: SendMsgDto): Promise<MessageDocument> {
    try {
      const supportRequest = await this.supportRequestModel.findById(
        dto.supportRequest,
      );
      const message = new this.messageModel({
        ...dto,
        sentAt: new Date(),
        readAt: null,
      });
      await message.save();
      supportRequest.messages = [...supportRequest.messages, message._id];
      await supportRequest.save();
      this.eventEmitter.emit('message.sent', supportRequest, message);
      return message;
    } catch (error) {
      console.error(error);
    }
  }

  async getMessages(supportRequestId: ID): Promise<MessageDocument[]> {
    try {
      const supportRequest = await this.supportRequestModel.findById(
        supportRequestId,
      );
      return this.messageModel.find({ _id: supportRequest.messages }).exec();
    } catch (error) {
      console.error(error);
    }
  }

  subscribe(
    handler: (
      supportRequest: SupportRequestDocument,
      message: MessageDocument,
    ) => void,
  ): () => void {
    this.eventEmitter.addListener('message.sent', handler);
    return () => {};
  }

  unsubscribe(
    handler: (
      supportRequest: SupportRequestDocument,
      message: MessageDocument,
    ) => void,
  ): () => void {
    this.eventEmitter.removeListener('message.sent', handler);
    return () => {};
  }

  getSupportRequestById(id: ID) {
    try {
      return this.supportRequestModel.findById(id).exec();
    } catch (error) {
      console.error(error);
    }
  }
}
