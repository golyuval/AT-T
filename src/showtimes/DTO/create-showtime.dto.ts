import { IsNotEmpty, IsNumber, IsString, IsDate, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class DTO_showtime_create 
{
  
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  movieId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsString()
  theater: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endTime: Date;
  
}