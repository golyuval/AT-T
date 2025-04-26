
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { Controller_Bookings } from './bookings.controller';
import { Service_Bookings } from './bookings.service';
import { Module_Showtimes } from '../showtimes/showtimes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    Module_Showtimes,  
  ],
  controllers: [Controller_Bookings],
  providers: [Service_Bookings],
})
export class Module_Bookings {}
