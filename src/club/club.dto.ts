import { IsNotEmpty, IsString, IsUrl, IsDate } from 'class-validator';

export class ClubDto {

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsDate()
  @IsNotEmpty()
  readonly foundation_date: string;

  @IsUrl()
  @IsNotEmpty()
  readonly image: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;
}
