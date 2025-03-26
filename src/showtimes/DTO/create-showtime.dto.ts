import { IsNotEmpty, IsNumber, IsString, IsDate, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class DTO_showtime_create 
{
  
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  movie_id: number;

  @IsNotEmpty()
  @IsString()
  theater: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  start_time: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  end_time: Date;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;
}