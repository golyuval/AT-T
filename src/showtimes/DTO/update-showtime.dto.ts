
import { IsOptional, IsNumber, IsString, IsDate, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class DTO_showtime_update 
{

  @IsOptional()
  @IsNumber()
  @IsPositive()
  movieId?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  theater?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startTime?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endTime?: Date;
  
}