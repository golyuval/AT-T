import { IsString, IsInt, IsNotEmpty, Min, Max, MinLength, MaxLength } from 'class-validator';

export class DTO_movie_create 
{
  
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  genre: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(600)
  duration: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  rating: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1900)
  @Max(2100)
  release_year: number;
}