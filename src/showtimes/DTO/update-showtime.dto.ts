
import { IsOptional, IsNumber, IsString, IsDate, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class DTO_showtime_update 
{

  @IsOptional()
  @IsNumber()
  @IsPositive()
  movie_id?: number;

  @IsOptional()
  @IsString()
  theater?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  start_time?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  end_time?: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
  
}