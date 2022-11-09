import {
    ConnectedSocket,
    MessageBody, OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer, WsException,
}                                 from '@nestjs/websockets'
import { EventEmitter2 }          from '@nestjs/event-emitter'
import { Server, Socket }         from "socket.io"
import { SupportRequestService }  from "./support-request.service"
import { AuthService }            from "../auth/auth.service"
import { UserService }            from "../user/user.service";
import { SupportRequestDocument } from "./schema/support-request.schema";
import { MessageDocument }        from "./schema/message.schema";
import { Role }                   from "../user/dto/user.dto";

@WebSocketGateway(8080)
export class SupportRequestGateway implements OnGatewayConnection {

    @WebSocketServer()
    server: Server

    public subscribers: {} = {}

    constructor(
        private readonly supportRequestService: SupportRequestService,
        private readonly userService: UserService,
        private readonly authService: AuthService,
        // private readonly eventEmitterService: EventEmitter2,
    ) {
    }

    async handleConnection(socket: Socket) {
        console.log('SupportRequestGateway.handleConnection()')
        //await this.authService.getUserFromSocket(socket)
    }

    @SubscribeMessage('subscribeToChat')
    async subscribeToChat(
        @MessageBody('chatId') chatId: string,
        @ConnectedSocket() socket: Socket,
    ) {
        console.log('Gateway->subscribeToChat()', chatId, socket.id)
        const user = await this.authService.getUserFromSocket(socket);
        console.log('User found', user)
        if (!user)
            throw new WsException('You are not authorized')
        const userId = user._id.toString()

        const supportRequest = await this.supportRequestService.getSupportRequestById(chatId)
        if (!supportRequest)
            throw new WsException('Support request not found')
        const supportRequestId = supportRequest._id.toString()

        const author = supportRequest.user.toString() === userId ? user : await this.userService.findById(supportRequest.user)

        if (!(user.role === Role.Admin || user.role === Role.Manager || (user.role === Role.Client && userId === supportRequest.user.toString()))) {
            throw new WsException('Only for client own support requests or manager')
        }

        const handler = (supportRequest: SupportRequestDocument, message: MessageDocument) => {
            console.log('SupportRequestGateway.subscribeHandler()', socket.id, supportRequest, message)
            const result = {
                id: message._id.toString(),
                createdAt: message.sentAt,
                text: message.text,
                readAt: message.readAt,
                author: {
                    id: author?._id,
                    name: author?.name
                }
            }
            this.server.sockets.in(socket.id).emit('message', result)
        }

        console.log(`Try to subscribe user ${userId} to support request ${supportRequestId}`, this.subscribers)

        if (!Object.keys(this.subscribers).includes(supportRequestId)) {
            console.log('Support request has no subscribers')
            this.subscribers[supportRequestId] = {}
        }

        const subscribers: {} = this.subscribers[supportRequestId]
        // Кто-то уже подписан на это support request
        if (Object.keys(subscribers).includes(userId)) {
            if (subscribers[userId].socketId !== socket.id) {
                this.supportRequestService.unsubscribe(subscribers[userId].handler)
                subscribers[userId] = {'socketId': socket.id, 'handler': handler}
                return this.supportRequestService.subscribe(handler)
            } else {
                throw new WsException('Already subscribed')
            }
        } else {
            subscribers[userId] = {'socketId': socket.id, 'handler': handler}
            return this.supportRequestService.subscribe(handler)
        }
    }

}
