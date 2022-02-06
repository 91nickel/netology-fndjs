import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';
import {CreateBookDto} from "../books/dto/create-book.dto";
import {plainToClass} from "class-transformer";
import {validate} from "class-validator";

@Injectable()
export class CreateBookPipe implements PipeTransform {
    async transform(incomingValues: any, {metatype}: ArgumentMetadata) {
        console.log('create book validation pipe...')
        if (!metatype)
            return incomingValues

        const object = plainToClass(metatype, incomingValues);
        const errors = await validate(object);
        if (errors.length > 0) {
            console.error(errors);
            throw new BadRequestException('Validation failed');
        }
        return incomingValues;
    }
}