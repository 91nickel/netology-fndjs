import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';
import {CreateBookDto} from "../books/dto/create-book.dto";

@Injectable()
export class JoiCreateBookPipe implements PipeTransform {
    constructor(private schema: any) {
    }
    public transform(incomingValues: CreateBookDto, metadata: ArgumentMetadata) {
        console.log('create book validation pipe...')
        const {error, value} = this.schema.validate(incomingValues)
        if (error) {
            console.error(error);
            throw new BadRequestException();
        }
        return value;
    }
}