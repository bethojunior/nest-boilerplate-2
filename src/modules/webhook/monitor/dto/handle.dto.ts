import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsDefined,
} from 'class-validator';

class DriverDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}

class ObjectDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => DriverDto)
  driver: DriverDto;
}

export class TripWebhookDto {
  @IsString()
  @IsNotEmpty()
  tripReference: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => ObjectDto)
  object: ObjectDto;
}
