import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';

@Injectable()
export class TestPipe implements PipeTransform {
    public transform(value: any, metadata: ArgumentMetadata) {
        console.log(`Pipe is working. Values: ${value}`);
        if (!value)
            throw new BadRequestException('Validation failed');
        return value;
    }
}