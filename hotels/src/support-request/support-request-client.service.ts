import { Injectable }                                     from '@nestjs/common'
import { Model, Schema as MongooseSchema }                from "mongoose"
import { InjectModel }                                    from "@nestjs/mongoose"
import { SupportRequest, SupportRequestDocument }         from "./schema/support-request.schema"
import { Message, MessageDocument }                       from "./schema/message.schema"
import { CreateSupportRequestDto, MarkAsReadMessagesDto } from "./dto/support-request.dto"

type ID = string | MongooseSchema.Types.ObjectId

interface ISupportRequestClientService {
    createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>

    markMessagesAsRead(params: MarkAsReadMessagesDto)

    getUnreadCount(supportRequest: ID): Promise<Message[]>
}

@Injectable()
export class SupportRequestClientService implements ISupportRequestClientService {

    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequestDocument>

    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>

    async createSupportRequest(dto: CreateSupportRequestDto): Promise<SupportRequest> {
        console.log('SupportRequestClientService.createSupportRequest()', dto)
        try {
            const request = new this.supportRequestModel(dto)
            return await request.save()
        } catch (error) {
            console.error(error)
        }
    }

    async markMessagesAsRead(dto: MarkAsReadMessagesDto) {
        console.log('SupportRequestClientService.markMessagesAsRead()', dto)
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
        console.log('SupportRequestClientService.getUnreadCount()', requestId)
        try {
            const request = await this.supportRequestModel.findById(requestId).exec()
            return Object.values(request.messages).filter(message => !message.readAt)
        } catch (error) {
            console.error(error)
        }
    }

}
