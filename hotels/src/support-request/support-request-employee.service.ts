import { Injectable }                                   from '@nestjs/common'
import { Model, Schema as MongooseSchema }              from "mongoose"
import { InjectModel }                                  from "@nestjs/mongoose"
import { SupportRequest, SupportRequestDocument }       from "./schema/support-request.schema"
import { Message, MessageDocument }                     from "./schema/message.schema"
import { MarkAsReadMessagesDto, MarkMessagesAsReadDto } from "./dto/support-request.dto"

type ID = string | MongooseSchema.Types.ObjectId

interface ISupportRequestEmployeeService {
    markMessagesAsRead(params: MarkMessagesAsReadDto)

    getUnreadCount(supportRequest: ID): Promise<MessageDocument[]>

    closeRequest(supportRequest: ID): Promise<void>
}

@Injectable()
export class SupportRequestEmployeeService implements ISupportRequestEmployeeService {

    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequestDocument>

    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>

    async markMessagesAsRead(dto: MarkAsReadMessagesDto) {
        console.log('SupportRequestEmployeeService.markMessagesAsRead()', dto)
        try {
            const request = await this.supportRequestModel.findOne({_id: dto.supportRequest, user: dto.user}).exec()
            const filter = {_id: {$in: request.messages}, dateCreate: {$lte: dto.createdBefore}}
            return this.messageModel.updateMany(filter, {readAt: new Date})
        } catch (error) {
            console.error(error)
        }
    }

    async getUnreadCount(requestId: ID): Promise<MessageDocument[]> {
        console.log('SupportRequestEmployeeService.getUnreadCount()', requestId)
        try {
            const request = await this.supportRequestModel.findById(requestId).exec()
            return Object.values(request.messages).filter(message => !message.readAt)
        } catch (error) {
            console.error(error)
        }
    }

    closeRequest(requestId: ID): Promise<void> {
        console.log('SupportRequestEmployeeService.closeRequest()', requestId)
        try {
            return this.supportRequestModel.findByIdAndUpdate(requestId, {isActive: false}).exec().then(() => {
            })
        } catch (error) {
            console.error(error)
        }
    }

}
