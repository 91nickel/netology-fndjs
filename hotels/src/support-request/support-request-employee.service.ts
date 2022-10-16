import { Injectable }                             from '@nestjs/common'
import { Model, Schema as MongooseSchema }        from "mongoose"
import { InjectModel }                            from "@nestjs/mongoose"
import { SupportRequest, SupportRequestDocument } from "./schema/support-request.schema"
import { Message, MessageDocument }               from "./schema/message.schema"
import { MarkAsReadMessagesDto }                  from "./dto/support-request.dto"

type ID = string | MongooseSchema.Types.ObjectId

interface ISupportRequestEmployeeService {
    markMessagesAsRead(params: MarkAsReadMessagesDto)

    getUnreadCount(supportRequest: ID): Promise<Message[]>

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
            const messageIds: ID[] = Object.values(request.messages).reduce((prev, next) => {
                return [...prev, next._id]
            }, [])
            const filter = {_id: {$in: messageIds}, dateCreate: {$lte: dto.createdBefore}}
            const update = {readAt: new Date}
            const result = await this.messageModel.updateMany(filter, update)
            console.log(result)
        } catch (error) {
            console.error(error)
        }
    }

    async getUnreadCount(requestId: ID): Promise<Message[]> {
        console.log('SupportRequestEmployeeService.getUnreadCount()', requestId)
        try {
            const request = await this.supportRequestModel.findById(requestId).exec()
            return Object.values(request.messages).filter(message => !message.readAt)
        } catch (error) {
            console.error(error)
        }
    }

    async closeRequest(requestId: ID): Promise<void> {
        console.log('SupportRequestEmployeeService.closeRequest()', requestId)
        try {
            const request = await this.supportRequestModel.findByIdAndUpdate(requestId, {isActive: false}).exec()
            return console.log(request)
        } catch (error) {
            console.error(error)
        }
    }

}
