import { IsEmail, IsInt, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

  export class DTO_booking_create {

    @IsNotEmpty()
    @IsInt()
    @Min(1)
    showtimeId: number;

    @IsNotEmpty()
    @Min(1)
    seatNumber: number;

    @IsNotEmpty()
    @IsString()
    userId: string;
      
  }