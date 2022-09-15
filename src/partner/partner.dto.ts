import { IsNotEmpty, IsString, IsDate, IsEmail } from 'class-validator';

export class PartnerDto {

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsDate()
  @IsNotEmpty()
  readonly birthday: string;

}
