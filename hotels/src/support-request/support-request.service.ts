import { Injectable }                             from '@nestjs/common'
import { InjectModel }                            from "@nestjs/mongoose"
import { Model, Schema as MongooseSchema }        from "mongoose"
import { SupportRequest, SupportRequestDocument } from "./schema/support-request.schema"
import { Message, MessageDocument }               from "./schema/message.schema"
import { SendMessageDto, ListSupportRequestsDto } from "./dto/support-request.dto"

type ID = string | MongooseSchema.Types.ObjectId

interface ISupportRequestService {

    findSupportRequests(params: ListSupportRequestsDto): Promise<SupportRequest[]>

    sendMessage(data: SendMessageDto): Promise<Message>

    getMessages(supportRequest: ID): Promise<Message[]>

    subscribe(
        handler: (supportRequest: SupportRequest, message: Message) => void
    ): () => void

}

@Injectable()
export class SupportRequestService implements ISupportRequestService {

    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequestDocument>

    @InjectModel(Message.name)
    private messageModel: Model<MessageDocument>

    async findSupportRequests(dto: ListSupportRequestsDto): Promise<SupportRequest[]> {
        console.log('SupportRequestService.findSupportRequests()', dto)
        try {
            const requests = this.supportRequestModel.find(dto).exec()
            console.log(requests)
            return requests
        } catch (error) {
            console.error(error)
        }
    }

    async sendMessage(dto: SendMessageDto): Promise<Message> {
        console.log('SupportRequestService.sendMessage()', dto)
        try {
            const message = new this.messageModel(dto)
            console.log(message)
            return await message.save()
        } catch (error) {
            console.error(error)
        }
    }

    async getMessages(id: ID): Promise<Message[]> {
        console.log('SupportRequestService.getMessages()', id)
        try {
            const request = await this.supportRequestModel.findById(id).exec()
            console.log(request)
            return request.messages
        } catch (error) {
            console.error(error)
        }
    }

    subscribe(handler: (supportRequest: SupportRequest, message: Message) => void): () => void {
        return () => {

        }
    }

}
