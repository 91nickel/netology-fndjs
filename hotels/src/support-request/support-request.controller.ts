import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { SupportRequestService } from './support-request.service';
import { SupportRequestClientService } from './support-request-client.service';
import { SupportRequestEmployeeService } from './support-request-employee.service';
import {
  CreateSupportReqDto,
  FindSupportRequestsDto,
  MarkAsReadMessagesDto,
  SendMsgDto,
} from './dto/support-request.dto';
import { JoiSupportRequestPipe } from '../pipe/support-request.pipe';
import {
  CreateSupportRequestSchema,
  FindSupportRequestSchema,
  MarkMessageAsReadSchema,
} from '../joi/support-request.schema';
import { RequestWithUser, Role } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import RoleGuard from '../auth/guards/role.guard';

@Controller()
export class SupportRequestController {
  constructor(
    private readonly userService: UserService,
    private readonly service: SupportRequestService,
    private readonly clientService: SupportRequestClientService,
    private readonly employeeService: SupportRequestEmployeeService,
  ) {}

  @Post('client/support-requests')
  @UseGuards(RoleGuard(Role.Client))
  async createClientSupportRequest(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Body(new JoiSupportRequestPipe(CreateSupportRequestSchema))
    body: Pick<CreateSupportReqDto, 'text'>,
  ) {
    const fields: CreateSupportReqDto = {
      user: request.user._id.toString(),
      text: body.text,
    };
    const supportRequest = await this.clientService.createSupportRequest(
      fields,
    );
    const result = {
      id: supportRequest._id.toString(),
      createdAt: supportRequest.createdAt,
      isActive: supportRequest.isActive,
      hasNewMessages: false,
    };
    return response.send(result);
  }

  @Get('client/support-requests')
  @UseGuards(RoleGuard(Role.Client))
  async getClientSupportRequests(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Query(new JoiSupportRequestPipe(FindSupportRequestSchema))
    query: Partial<FindSupportRequestsDto>,
  ) {
    const body: FindSupportRequestsDto = {
      limit: query.limit ? +query.limit : 50,
      offset: query.offset ? +query.offset : 0,
      isActive: query.isActive !== false,
      user: request.user._id.toString(),
    };
    const supportRequests = await this.service.findSupportRequests(body);

    const result = await Promise.all(
      supportRequests.map(async (supportRequest) => {
        return {
          id: supportRequest._id.toString(),
          createdAt: supportRequest.createdAt.toDateString(),
          isActive: supportRequest.isActive,
          hasNewMessages: !!(
            await this.clientService.getUnreadCount(
              supportRequest._id.toString(),
            )
          ).length,
        };
      }),
    );

    return response.send(result);
  }

  @Get('manager/support-requests')
  @UseGuards(RoleGuard(Role.Manager))
  async getManagerSupportRequests(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Query(new JoiSupportRequestPipe(FindSupportRequestSchema))
    query: Partial<FindSupportRequestsDto>,
  ) {
    const user = await this.userService.findById(request.user._id.toString());
    if (!user) throw new NotFoundException('User not found');

    const body: FindSupportRequestsDto = {
      limit: query.limit ? query.limit : 50,
      offset: query.offset ? query.offset : 0,
      isActive: query.isActive !== false,
    };

    const supportRequest = await this.service.findSupportRequests(body);
    const result = await Promise.all(
      supportRequest.map(async (supportRequest) => {
        const user = await this.userService.findById(
          supportRequest.user.toString(),
        );
        return {
          id: supportRequest._id.toString(),
          createdAt: supportRequest.createdAt,
          isActive: supportRequest.isActive,
          hasNewMessages: !!(
            await this.clientService.getUnreadCount(
              supportRequest._id.toString(),
            )
          ).length,
          client: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            contactPhone: user.contactPhone,
          },
        };
      }),
    );
    return response.send(result);
  }

  @Get('common/support-requests/:id/messages')
  @UseGuards(RoleGuard(Role.Client, Role.Manager))
  async getMessagesByRequestId(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Param('id') id: string,
  ) {
    const supportRequest = await this.service.getSupportRequestById(id);
    if (!supportRequest)
      throw new NotFoundException('Support request not found');

    if (
      !(
        request.user.role === Role.Manager ||
        (request.user.role === Role.Client &&
          request.user._id.toString() === supportRequest.user.toString())
      )
    ) {
      throw new ForbiddenException(
        'Only for client own support requests or manager',
      );
    }

    const user =
      request.user.role === Role.Manager
        ? request.user
        : await this.userService.findById(supportRequest.user.toString());
    if (!user) throw new NotFoundException('User not found');

    const messages = await this.service.getMessages(
      supportRequest._id.toString(),
    );
    const result = messages.map((message) => {
      return {
        id: message._id.toString(),
        createdAt: message.sentAt,
        text: message.text,
        readAt: message.readAt,
        author: {
          id: user._id.toString(),
          name: user.name,
        },
      };
    });
    return response.send(result);
  }

  @Post('common/support-requests/:id/messages')
  @UseGuards(RoleGuard(Role.Client, Role.Manager))
  async sendMessage(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Param('id') id: string,
    @Body(new JoiSupportRequestPipe(CreateSupportRequestSchema)) body,
  ) {
    const supportRequest = await this.service.getSupportRequestById(id);
    if (!supportRequest)
      throw new NotFoundException('Support request not found');

    if (
      !(
        request.user.role === Role.Manager ||
        (request.user.role === Role.Client &&
          request.user._id.toString() === supportRequest.user.toString())
      )
    ) {
      throw new ForbiddenException(
        'Only for client own support requests or manager',
      );
    }

    const user =
      request.user.role === Role.Manager
        ? request.user
        : await this.userService.findById(supportRequest.user.toString());
    if (!user) throw new NotFoundException('User not found');

    const dto: SendMsgDto = {
      author: user._id.toString(),
      supportRequest: supportRequest._id.toString(),
      text: body.text,
    };
    const message = await this.service.sendMessage(dto);

    const result = {
      id: message._id.toString(),
      createdAt: message.sentAt,
      text: message.text,
      readAt: message.readAt,
      author: {
        id: request.user._id.toString(),
        name: request.user.name,
      },
    };

    return response.send(result);
  }

  @Post('common/support-requests/:id/messages/read')
  @UseGuards(RoleGuard(Role.Client, Role.Manager))
  async markMessageAsRead(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Param('id') id: string,
    @Body(new JoiSupportRequestPipe(MarkMessageAsReadSchema)) body,
  ) {
    const supportRequest = await this.service.getSupportRequestById(id);
    if (!supportRequest)
      throw new NotFoundException('Support request not found');

    if (
      !(
        request.user.role === Role.Manager ||
        (request.user.role === Role.Client &&
          request.user._id.toString() === supportRequest.user.toString())
      )
    ) {
      throw new ForbiddenException(
        'Only for client own support requests or manager',
      );
    }

    const user =
      request.user.role === Role.Client
        ? request.user
        : await this.userService.findById(supportRequest.user.toString());
    if (!user) throw new NotFoundException('User not found');

    const dto: MarkAsReadMessagesDto = {
      user: user._id.toString(),
      supportRequest: supportRequest._id.toString(),
      createdBefore: new Date(body.createdBefore),
    };
    await this.employeeService.markMessagesAsRead(dto);

    return response.send({ success: true });
  }
}
