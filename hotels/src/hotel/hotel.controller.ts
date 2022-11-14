import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as md5 from 'md5';

import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/hotel.dto';
import { HotelRoomService } from '../hotel-room/hotel-room.service';
import {
  CreateHotelRoomDto,
  SearchHotelRoomsDto,
} from '../hotel-room/dto/hotel-room.dto';
import { JoiHotelPipe } from '../pipe/hotel.pipe';
import {
  CreateHotelRoomSchema,
  FindHotelRoomsSchema,
  UpdateHotelRoomSchema,
} from '../joi/hotel-room.schema';
import {
  CreateHotelSchema,
  FindHotelsSchema,
  UpdateHotelSchema,
} from '../joi/hotel.schema';
import { RequestWithUser, Role } from '../user/dto/user.dto';
import RoleGuard from '../auth/guards/role.guard';

function imageFilename(req, file, cb) {
  const name = `${md5(
    [file.originalname, file.mimetype, file.size].join('|'),
  )}${path.extname(file.originalname)}`;
  cb(null, name);
}

@Controller()
export class HotelController {
  constructor(
    private readonly hotelService: HotelService,
    private readonly hotelRoomService: HotelRoomService,
  ) {}

  @Get('common/hotel-rooms')
  async getRooms(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Query(new JoiHotelPipe(FindHotelRoomsSchema))
    query: { hotel: string; limit?: string; offset?: string },
  ) {
    const dto: SearchHotelRoomsDto = {
      hotel: query.hotel,
      limit: query.limit ? +query.limit : 50,
      offset: query.offset ? +query.offset : 0,
    };
    if (!request.user || request.user.role === Role.Client)
      dto.isEnabled = true;

    const hotel = await this.hotelService.findById(query.hotel);
    if (!hotel) throw new NotFoundException(`Hotel ${query.hotel} not found`);

    const rooms = await this.hotelRoomService.search(dto);
    const result = rooms.map((room) => {
      return {
        id: room._id.toString(),
        description: room.description,
        images: room.images,
        hotel: {
          id: hotel._id.toString(),
          title: hotel.title,
        },
      };
    });
    return response.send(result);
  }

  @Get('common/hotel-rooms/:id')
  async getRoom(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Param('id') roomId: string,
  ) {
    const room = await this.hotelRoomService.findById(roomId);
    if (!room) throw new NotFoundException(`Can not find room ${roomId}`);

    if (
      (!request.user || request.user.role === Role.Client) &&
      room.isEnabled !== true
    )
      throw new NotFoundException(`Can not find room ${roomId}`);

    const hotel = await this.hotelService.findById(room.hotel);
    if (!hotel)
      throw new NotFoundException(`Can not find hotel for room ${roomId}`);

    const result = {
      id: room._id.toString(),
      description: room.description,
      images: room.images,
      hotel: {
        id: hotel._id.toString(),
        title: hotel.title,
        description: hotel.description,
      },
    };
    return response.send(result);
  }

  @Get('admin/hotels/')
  @UseGuards(RoleGuard(Role.Admin))
  async getHotels(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Query(new JoiHotelPipe(FindHotelsSchema))
    query: { limit?: string; offset?: string },
  ) {
    const limit = !!query.limit ? +query.limit : 50;
    const offset = !!query.offset ? +query.offset : 0;

    const hotels = await this.hotelService.find({}, limit, offset);
    const result = hotels.map((hotel) => {
      return {
        id: hotel._id.toString(),
        title: hotel.title,
        description: hotel.description,
      };
    });
    return response.send(result);
  }

  @Post('admin/hotels/')
  @UseGuards(RoleGuard(Role.Admin))
  async createHotel(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Body(new JoiHotelPipe(CreateHotelSchema))
    body: { title: string; description?: string },
  ) {
    const dto: CreateHotelDto = {
      title: body.title,
      description: body.description,
    };
    const hotel = await this.hotelService.create(dto);
    const result = {
      id: hotel._id.toString(),
      title: hotel.title,
      description: hotel.description,
    };
    return response.send(result);
  }

  @Put('admin/hotels/:id')
  @UseGuards(RoleGuard(Role.Admin))
  async updateHotel(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Param('id') id,
    @Body(new JoiHotelPipe(UpdateHotelSchema))
    body: { title?: string; description?: string },
  ) {
    const hotel = await this.hotelService.update(id, body);

    if (!hotel) throw new NotFoundException(`Hotel ${id} not found`);

    const result = {
      id: hotel._id.toString(),
      title: hotel.title,
      description: hotel.description,
    };

    return response.send(result);
  }

  @Post('admin/hotel-rooms/')
  @UseGuards(RoleGuard(Role.Admin))
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './public/hotel-room',
        filename: imageFilename,
      }),
    }),
  )
  async createHotelRoom(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Body(new JoiHotelPipe(CreateHotelRoomSchema))
    body: { description: string; hotelId: string },
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    const hotel = await this.hotelService.findById(body.hotelId);
    if (!hotel) throw new NotFoundException(`Hotel ${body.hotelId} not found`);

    const dto: CreateHotelRoomDto = {
      description: body.description,
      hotel: body.hotelId,
      isEnabled: true,
      images: images.map((file) => file.path.replace('public/', '/')),
    };

    const room = await this.hotelRoomService.create(dto);

    const result = {
      id: room._id.toString(),
      description: room.description,
      images: room.images,
      isEnabled: room.isEnabled,
      hotel: {
        id: hotel._id.toString(),
        title: hotel.title,
        description: hotel.description,
      },
    };
    return response.send(result);
  }

  @Put('admin/hotel-rooms/:id')
  @UseGuards(RoleGuard(Role.Admin))
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './public/hotel-room',
        filename: imageFilename,
      }),
    }),
  )
  async updateHotelRoom(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Param('id') id,
    @Body(new JoiHotelPipe(UpdateHotelRoomSchema))
    body: { description?: string; hotelId?: string; images: string[] },
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    let hotel;
    if (body.hotelId) {
      hotel = await this.hotelService.findById(body.hotelId);
      if (!hotel)
        throw new NotFoundException(`Hotel ${body.hotelId} not found`);
    }

    const room = await this.hotelRoomService.findById(id);
    if (!room) throw new NotFoundException(`Room ${id} not found`);

    if (body.description) room.description = body.description;
    if (body.hotelId) room.hotel = body.hotelId;
    if (Array.isArray(body.images) || images.length)
      room.images = Array.from(
        new Set([
          ...images.map((file) => file.path.replace('public/', '/')),
          ...body.images,
        ]),
      );

    await room.save();

    if (!hotel) hotel = await this.hotelService.findById(room.hotel.toString());

    const result = {
      id: room._id.toString(),
      description: room.description,
      images: room.images,
      isEnabled: room.isEnabled,
      hotel: {
        id: hotel._id.toString(),
        title: hotel.title,
        description: hotel.description,
      },
    };

    return response.send(result);
  }
}
