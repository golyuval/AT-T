import { IsString, IsInt, IsOptional, Min, Max, MinLength, MaxLength, IsNumber } from 'class-validator';

export class DTO_movie_update 
{

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  genre?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(600)
  duration?: number;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  releaseYear?: number;
  
}