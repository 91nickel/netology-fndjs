import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import {
  SupportRequest,
  SupportRequestDocument,
} from './schema/support-request.schema';
import { Message, MessageDocument } from './schema/message.schema';
import {
  CreateSupportReqDto,
  CreateSupportRequestDto,
  MarkAsReadMessagesDto,
  MarkMessagesAsReadDto,
} from './dto/support-request.dto';

type ID = string | MongooseSchema.Types.ObjectId;

interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;

  markMessagesAsRead(params: MarkMessagesAsReadDto);

  getUnreadCount(supportRequest: ID): Promise<MessageDocument[]>;
}

@Injectable()
export class SupportRequestClientService
  implements ISupportRequestClientService
{
  @InjectModel(SupportRequest.name)
  private supportRequestModel: Model<SupportRequestDocument>;

  @InjectModel(Message.name)
  private messageModel: Model<MessageDocument>;

  createSupportRequest(
    dto: CreateSupportReqDto,
  ): Promise<SupportRequestDocument> {
    try {
      const fields: Partial<SupportRequestDocument> = {
        ...dto,
        createdAt: new Date(),
        isActive: true,
      };
      return new this.supportRequestModel(fields).save();
    } catch (error) {
      console.error(error);
    }
  }

  async markMessagesAsRead(dto: MarkAsReadMessagesDto) {
    try {
      const request = await this.supportRequestModel
        .findOne({ _id: dto.supportRequest, user: dto.user })
        .exec();
      const filter = {
        _id: { $in: request.messages },
        dateCreate: { $lte: dto.createdBefore },
      };
      const update = { readAt: new Date() };
      return this.messageModel
        .updateMany(filter, update)
        .exec()
        .then(() => {});
    } catch (error) {
      console.error(error);
    }
  }

  async getUnreadCount(requestId: ID): Promise<MessageDocument[]> {
    try {
      const request = await this.supportRequestModel.findById(requestId).exec();
      return Object.values(request.messages).filter(
        (message) => !message.readAt,
      );
    } catch (error) {
      console.error(error);
    }
  }
}
