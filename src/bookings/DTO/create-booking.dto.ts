import { IsEmail, IsInt, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class DTO_booking_create {

  @IsNotEmpty()
  @IsInt()
  showtimeId: number;

  @IsNotEmpty()
  @Min(1)
  seatNumber: number;

  @IsNotEmpty()
  @IsString()
  userId: string;
    
}