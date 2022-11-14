import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class JoiSupportRequestPipe implements PipeTransform {
  constructor(private schema: any) {}

  public transform(incomingValues) {
    const { error, value } = this.schema.validate(incomingValues);
    if (error) {
      console.error(error);
      throw new BadRequestException(error.details[0].message);
    }
    return value;
  }
}
