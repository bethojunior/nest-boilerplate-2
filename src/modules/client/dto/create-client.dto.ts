import {
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  appName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(11)
  phone: string;

}
