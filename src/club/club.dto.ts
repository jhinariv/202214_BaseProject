import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUrl, IsDate } from 'class-validator';

export class ClubDto {

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  readonly foundation_date: Date;

  @IsUrl()
  @IsNotEmpty()
  readonly image: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;
}
