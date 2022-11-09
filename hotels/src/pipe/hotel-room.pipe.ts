import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class JoiHotelRoomPipe implements PipeTransform {
    constructor(private schema: any) {
    }

    public transform(incomingValues, metadata: ArgumentMetadata) {
        console.log('JoiHotelRoomPipe.transform()', incomingValues)
        const {error, value} = this.schema.validate(incomingValues)
        if (error) {
            console.error(error);
            throw new BadRequestException(error.details[0].message);
        }
        return value;
    }
}