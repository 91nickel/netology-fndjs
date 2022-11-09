import { Module }                               from '@nestjs/common'
import { MongooseModule }                       from "@nestjs/mongoose"
import { ApiSupportRequestController }          from './api-support-request.controller'
import { SupportRequest, SupportRequestSchema } from "../support-request/schema/support-request.schema"
import { Message, MessageSchema }               from "../support-request/schema/message.schema"
import { SupportRequestService }                from "../support-request/support-request.service"
import { SupportRequestClientService }          from "../support-request/support-request-client.service"
import { SupportRequestEmployeeService }        from "../support-request/support-request-employee.service"
import { MessageSentListener }                  from "../support-request/listeners/message-sent.listener"
import { User, UserSchema }                     from "../user/schema/user.schema"
import { UserService }                          from "../user/user.service"
import { SupportRequestGateway }                from "../support-request/support-request.gateway"
import { AuthModule }                           from "../auth/auth.module"

@Module({
    controllers: [ApiSupportRequestController],
    imports: [
        MongooseModule.forFeature([
            {name: SupportRequest.name, schema: SupportRequestSchema},
        ]),
        MongooseModule.forFeature([
            {name: Message.name, schema: MessageSchema},
        ]),
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema},
        ]),
        AuthModule,
    ],
    providers: [
        SupportRequestService,
        SupportRequestClientService,
        SupportRequestEmployeeService,
        SupportRequestGateway,
        MessageSentListener,
        UserService,
    ],
})
export class ApiSupportRequestModule {
}
