import {
    Controller,
    Body,
    Query,
    Param,
    HttpException,
    Delete,
    Get,
    Patch,
    Post,
    Render,
    Res,
    Req,
    Put,
    UnauthorizedException,
    ForbiddenException,
    BadRequestException,
    NotFoundException,
}                                        from '@nestjs/common';
import { SupportRequestService }         from '../support-request/support-request.service'
import { SupportRequestClientService }   from '../support-request/support-request-client.service'
import { SupportRequestEmployeeService } from '../support-request/support-request-employee.service'
import { Request, Response }             from "express";
import { UserDocument }                  from "../user/schema/user.schema";
import {
    CreateSupportReqDto,
    FindSupportRequestsDto, MarkAsReadMessagesDto,
    SendMsgDto
}                                        from "../support-request/dto/support-request.dto";
import { JoiSupportRequestPipe }         from "../pipe/support-request.pipe";
import {
    CreateSupportRequestSchema,
    FindSupportRequestSchema,
    MarkMessageAsReadSchema
}                                        from "../joi/support-request.schema";
import { RequestWithUser, Role }         from "../user/dto/user.dto";
import { UserService }                   from "../user/user.service";

@Controller('api')
export class ApiSupportRequestController {
    constructor(
        private readonly userService: UserService,
        private readonly service: SupportRequestService,
        private readonly clientService: SupportRequestClientService,
        private readonly employeeService: SupportRequestEmployeeService,
    ) {
    }

    @Post('client/support-requests')
    async createClientSupportRequest(
        @Req() request: RequestWithUser,
        @Res() response: Response,
        @Body(new JoiSupportRequestPipe(CreateSupportRequestSchema)) body: Pick<CreateSupportReqDto, 'text'>,
    ) {
        console.log('ApiSupportRequestController.createClientSupportRequest', body)

        if (!request.user)
            throw new UnauthorizedException('You are not authorized')
        if (request.user.role !== Role.Client)
            throw new ForbiddenException('Only for client')

        const fields: CreateSupportReqDto = {
            user: request.user._id.toString(),
            text: body.text,
        }
        const supportRequest = await this.clientService.createSupportRequest(fields)
        const result = {
            id: supportRequest._id.toString(),
            createdAt: supportRequest.createdAt,
            isActive: supportRequest.isActive,
            hasNewMessages: false,
        }
        return response.send(result)
    }

    @Get('client/support-requests')
    async getClientSupportRequests(
        @Req() request: RequestWithUser,
        @Res() response: Response,
        @Query(new JoiSupportRequestPipe(FindSupportRequestSchema)) query: Partial<FindSupportRequestsDto>,
    ) {
        console.log('ApiSupportRequestController.getClientSupportRequests', query);

        if (!request.user)
            throw new UnauthorizedException('You are not authorized')
        if (request.user.role !== Role.Client)
            throw new ForbiddenException('Only for clients')

        const body: FindSupportRequestsDto = {
            limit: query.limit ? +query.limit : 50,
            offset: query.offset ? +query.offset : 0,
            isActive: query.isActive !== false,
            user: request.user._id.toString(),
        };
        const supportRequests = await this.service.findSupportRequests(body)

        const result = await Promise.all(supportRequests.map(async supportRequest => {
            return {
                id: supportRequest._id.toString(),
                createdAt: supportRequest.createdAt.toDateString(),
                isActive: supportRequest.isActive,
                hasNewMessages: !!(await this.clientService.getUnreadCount(supportRequest._id.toString())).length,
            }
        }))

        return response.send(result)
    }

    @Get('manager/support-requests')
    async getManagerSupportRequests(
        @Req() request: RequestWithUser,
        @Res() response: Response,
        @Query(new JoiSupportRequestPipe(FindSupportRequestSchema)) query: Partial<FindSupportRequestsDto>,
    ) {
        console.log('ApiSupportRequestController.getManagerSupportRequests', query)

        if (!request.user)
            throw new UnauthorizedException('You are not authorized')
        if (request.user.role !== Role.Manager)
            throw new ForbiddenException('Only for manager')

        const user = await this.userService.findById(request.user._id.toString())
        if (!user)
            throw new NotFoundException('User not found')

        const body: FindSupportRequestsDto = {
            limit: query.limit ? query.limit : 50,
            offset: query.offset ? query.offset : 0,
            isActive: query.isActive !== false,
            // user: user._id.toString(),
        };

        const supportRequest = await this.service.findSupportRequests(body)
        const result = await Promise.all(supportRequest.map(async supportRequest => {
            const user = await this.userService.findById(supportRequest.user.toString())
            return {
                id: supportRequest._id.toString(),
                createdAt: supportRequest.createdAt,
                isActive: supportRequest.isActive,
                hasNewMessages: !!(await this.clientService.getUnreadCount(supportRequest._id.toString())).length,
                client: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    contactPhone: user.contactPhone,
                }
            }
        }))
        return response.send(result)
    }

    @Get('common/support-requests/:id/messages')
    async getMessagesByRequestId(
        @Req() request: RequestWithUser,
        @Res() response: Response,
        @Param('id') id: string
    ) {
        console.log('ApiSupportRequestController.createClientSupportRequest', id)

        if (!request.user)
            throw new UnauthorizedException('You are not authorized')

        const supportRequest = await this.service.getSupportRequestById(id)
        if (!supportRequest)
            throw new NotFoundException('Support request not found')

        if (!(request.user.role === Role.Manager || (request.user.role === Role.Client && request.user._id.toString() === supportRequest.user.toString()))) {
            throw new ForbiddenException('Only for client own support requests or manager')
        }

        const user = request.user.role === Role.Manager ? request.user : await this.userService.findById(supportRequest.user.toString())
        if (!user)
            throw new NotFoundException('User not found')

        const messages = await this.service.getMessages(supportRequest._id.toString());
        const result = messages.map(message => {
            return {
                id: message._id.toString(),
                createdAt: message.sentAt,
                text: message.text,
                readAt: message.readAt,
                author: {
                    id: user._id.toString(),
                    name: user.name
                }
            }
        })
        return response.send(result);
    }

    @Post('common/support-requests/:id/messages')
    async sendMessage(
        @Req() request: RequestWithUser,
        @Res() response: Response,
        @Param('id') id: string,
        @Body(new JoiSupportRequestPipe(CreateSupportRequestSchema)) body,
    ) {
        console.log('ApiSupportRequestController.sendMessage', id, body)

        if (!request.user)
            throw new UnauthorizedException('You are not authorized')

        const supportRequest = await this.service.getSupportRequestById(id)
        if (!supportRequest)
            throw new NotFoundException('Support request not found')

        if (!(request.user.role === Role.Manager || (request.user.role === Role.Client && request.user._id.toString() === supportRequest.user.toString()))) {
            throw new ForbiddenException('Only for client own support requests or manager')
        }

        const user = request.user.role === Role.Manager ? request.user : await this.userService.findById(supportRequest.user.toString())
        if (!user)
            throw new NotFoundException('User not found')

        const dto: SendMsgDto = {
            author: user._id.toString(),
            supportRequest: supportRequest._id.toString(),
            text: body.text,
        }
        const message = await this.service.sendMessage(dto)

        const result = {
            id: message._id.toString(),
            createdAt: message.sentAt,
            text: message.text,
            readAt: message.readAt,
            author: {
                id: request.user._id.toString(),
                name: request.user.name,
            }
        }

        return response.send(result)
    }

    @Post('common/support-requests/:id/messages/read')
    async markMessageAsRead(
        @Req() request: RequestWithUser,
        @Res() response: Response,
        @Param('id') id: string,
        @Body(new JoiSupportRequestPipe(MarkMessageAsReadSchema)) body,
    ) {
        console.log('ApiSupportRequestController.emitMessageReadEvent', id, body)

        if (!request.user)
            throw new UnauthorizedException('You are not authorized')

        const supportRequest = await this.service.getSupportRequestById(id)
        if (!supportRequest)
            throw new NotFoundException('Support request not found')

        if (!(request.user.role === Role.Manager || (request.user.role === Role.Client && request.user._id.toString() === supportRequest.user.toString()))) {
            throw new ForbiddenException('Only for client own support requests or manager')
        }

        const user = request.user.role === Role.Client ? request.user : await this.userService.findById(supportRequest.user.toString())
        if (!user)
            throw new NotFoundException('User not found')

        const dto: MarkAsReadMessagesDto = {
            user: user._id.toString(),
            supportRequest: supportRequest._id.toString(),
            createdBefore: new Date(body.createdBefore),
        }
        await this.employeeService.markMessagesAsRead(dto)

        return response.send({success: true})
    }
}
