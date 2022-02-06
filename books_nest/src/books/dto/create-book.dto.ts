import {Schema} from 'mongoose';
import {IsString, MinLength, MaxLength, IsOptional} from 'class-validator';

export class CreateBookDto {
    @IsOptional()
    _id?: Schema.Types.ObjectId

    @IsString()
    @MinLength(5)
    @MaxLength(10)
    @IsOptional()
    title?: string

    @IsString()
    @MinLength(5)
    @MaxLength(10)
    @IsOptional()
    description?: string

    @IsOptional()
    authors?: string

    @IsOptional()
    favorite?: string

    @IsOptional()
    fileCover?: string

    @IsOptional()
    fileName?: string

    @IsOptional()
    fileBook?: string

    @IsOptional()
    comments?: object[]
}