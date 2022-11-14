import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schema/message.schema';
import {
  SupportRequest,
  SupportRequestSchema,
} from './schema/support-request.schema';
import { SupportRequestController } from './support-request.controller';
import { SupportRequestService } from './support-request.service';
import { SupportRequestClientService } from './support-request-client.service';
import { SupportRequestEmployeeService } from './support-request-employee.service';
import { SupportRequestGateway } from './support-request.gateway';
import { UserService } from '../user/user.service';
import { User, UserSchema } from '../user/schema/user.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
  ],
  providers: [
    SupportRequestService,
    SupportRequestClientService,
    SupportRequestEmployeeService,
    SupportRequestGateway,
    UserService,
  ],
  controllers: [SupportRequestController],
})
export class SupportRequestModule {}
