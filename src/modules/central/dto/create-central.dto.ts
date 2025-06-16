import { IsNotEmpty } from 'class-validator';

export class CreateCentralDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  mobicityCode: string;


  @IsNotEmpty()
  clientId: string;

  @IsNotEmpty()
  centralIdExternal: number;

}
