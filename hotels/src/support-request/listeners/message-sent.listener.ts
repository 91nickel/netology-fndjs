import { Injectable }            from '@nestjs/common';
import { OnEvent }               from '@nestjs/event-emitter';
import { SupportRequestService } from "../support-request.service";
import { WebSocketServer }       from "@nestjs/websockets";
import { Server }                from "socket.io";

@Injectable()
export class MessageSentListener {

    @WebSocketServer()
    server: Server;

    constructor(
        private supportRequestService: SupportRequestService,
    ) {
    }

    @OnEvent('message.sent')
    handleMessageSentEvent(event: {}) {
        console.log('MessageSentListener.handleMessageSentEvent()', event);
    }
}