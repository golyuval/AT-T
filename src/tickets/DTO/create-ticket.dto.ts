import { IsEmail, IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class DTO_ticket_create {

  @IsNotEmpty()
  @IsInt()
  showtime_id: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  seat: string;
}