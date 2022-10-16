import {
    Controller,
    Body, Query, Param,
    HttpException,
    Delete, Get, Patch, Post, Render, Res, Req, Put,
}                                        from '@nestjs/common';
import { SupportRequestService }         from "./support-request.service";
import { SupportRequestClientService }   from "./support-request-client.service";
import { SupportRequestEmployeeService } from "./support-request-employee.service";
import {
    CreateSupportRequestDto, ListSupportRequestsDto, MarkAsReadMessagesDto, SendMessageDto
}                                        from "./dto/support-request.dto";

@Controller()
export class SupportRequestController {

    constructor(
        private readonly supportRequestService: SupportRequestService,
        private readonly supportRequestClientService: SupportRequestClientService,
        private readonly supportRequestEmployeeService: SupportRequestEmployeeService,
    ) {
    }

    @Get('api/client/support-requests/')
    getSupportRequestsFromClient(@Query() query: Pick<ListSupportRequestsDto, 'limit' | 'offset' | 'isActive'>) {
        /*
        TODO: Позволяет пользователю с ролью client получить список обращений для текущего пользователя.
            Формат ответа
            [
              {
                "id": string,
                "createdAt": string,
                "isActive": boolean,
                "hasNewMessages": boolean
              }
            ]
            Доступно только пользователям с ролью client.
            401 - если пользователь не аутентифицирован;
            403 - если роль пользователя не подходит.
        */
        console.log('SupportRequestController.getSupportRequestsFromClient', query);
        return `SupportRequestController.getSupportRequestsFromClient(${JSON.stringify(query)})`;
    }

    @Get('api/manager/support-requests/')
    getSupportRequestsFromManager(@Query() query: Pick<ListSupportRequestsDto, 'limit' | 'offset' | 'isActive'>) {
        /*
        TODO: Позволяет пользователю с ролью manager получить список обращений от клиентов.
            Формат ответа
            [
              {
                "id": string,
                "createdAt": string,
                "isActive": boolean,
                "hasNewMessages": boolean,
                "client": {
                  "id": string,
                  "name": string,
                  "email": string,
                  "contactPhone": string
                }
              }
            ]
            Доступно только пользователям с ролью manager.
            401 - если пользователь не аутентифицирован;
            403 - если роль пользователя не подходит.
        */
        console.log('SupportRequestController.getSupportRequestsFromManager', query);
        return `SupportRequestController.getSupportRequestsFromManager(${JSON.stringify(query)})`;
    }

    @Get('api/common/support-requests/:id/messages')
    getMessagesByRequestId(@Param('id') id: string) {
        /*
        TODO: Позволяет пользователю с ролью manager или client получить все сообщения из чата.
            [
              {
                "id": string,
                "createdAt": string,
                "text": string,
                "readAt": string,
                "author": {
                  "id": string,
                  "name": string
                }
              }
            ]
            Доступно только пользователям с ролью manager и пользователю с ролью client, который создал обращение.
            401 - если пользователь не аутентифицирован;
            403 - если роль пользователя не подходит.
        */
        console.log('SupportRequestController.getMessagesByRequestId', id);
        return `SupportRequestController.getMessagesByRequestId(${id})`;
    }

    @Post('api/client/support-requests/')
    createSupportRequest(@Body() body: Pick<CreateSupportRequestDto, 'text'>) {
        /*
        TODO: Позволяет пользователю с ролью client создать обращение в техподдержку.
            Формат ответа
            [
              {
                "id": string,
                "createdAt": string,
                "isActive": boolean,
                "hasNewMessages": boolean
              }
            ]
            Доступно только пользователям с ролью client.
            401 - если пользователь не аутентифицирован;
            403 - если роль пользователя не подходит.
        */
        console.log('SupportRequestController.createSupportRequest', body);
        return `SupportRequestController.createSupportRequest(${JSON.stringify(body)})`;
    }

    @Post('api/common/support-requests/:id/messages')
    sendMessage(@Body() body: Pick<SendMessageDto, 'text'>) {
        /*
        TODO: Позволяет пользователю с ролью manager или client отправлять сообщения в чат.
            Формат ответа
            [
              {
                "id": string,
                "createdAt": string,
                "text": string,
                "readAt": string,
                "author": {
                  "id": string,
                  "name": string
                }
              }
            ]
            Доступно только пользователям с ролью manager и пользователю с ролью client, который создал обращение.
            401 - если пользователь не аутентифицирован;
            403 - если роль пользователя не подходит.
        */
        console.log('SupportRequestController.sendMessage', body);
        return `SupportRequestController.sendMessage(${JSON.stringify(body)})`;
    }

    @Post('api/common/support-requests/:id/messages')
    emitEventRead(@Param('id') id: string, @Body() body: Pick<MarkAsReadMessagesDto, 'createdBefore'>) {
        /*
        TODO: Позволяет пользователю с ролью manager или client отправлять отметку, что сообщения прочитаны.
            Формат ответа
            {
              "success": true
            }
            Доступно только пользователям с ролью manager и пользователю с ролью client, который создал обращение.
            401 - если пользователь не аутентифицирован;
            403 - если роль пользователя не подходит.
        */
        console.log('SupportRequestController.sendMessage', id, body);
        return `SupportRequestController.sendMessage(${id}, ${JSON.stringify(body)})`;
    }

    listenSupportRequest() {
        /*
        TODO: Позволяет пользователю с ролью manager или client получать новые сообщения в чате через WebSocket.
            Команда
            message: subscribeToChat payload: chatId
            Формат ответа
            {
              "id": string,
              "createdAt": string,
              "text": string,
              "readAt": string,
              "author": {
                "id": string,
                "name": string
              }
            }
            Доступно только пользователям с ролью manager и пользователю с ролью client, который создал обращение.
        */
        console.log('SupportRequestController.listenSupportRequest');
        return `SupportRequestController.listenSupportRequest()`;
    }
}
