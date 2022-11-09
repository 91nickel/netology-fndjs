import { Module }                               from '@nestjs/common';
import { MongooseModule }                       from "@nestjs/mongoose";
import { Message, MessageSchema }               from "./schema/message.schema";
import { SupportRequest, SupportRequestSchema } from "./schema/support-request.schema";
import { SupportRequestService }                from './support-request.service';
import { SupportRequestClientService }          from './support-request-client.service';
import { SupportRequestEmployeeService }        from './support-request-employee.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: SupportRequest.name, schema: SupportRequestSchema},
            {name: Message.name, schema: MessageSchema},
        ])
    ],
    providers: [
        SupportRequestService,
        SupportRequestClientService,
        SupportRequestEmployeeService,
    ],
    controllers: [],
})
export class SupportRequestModule {
}
