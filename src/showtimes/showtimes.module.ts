import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Controller_Showtime } from './showtimes.controller';
import { Service_Showtimes } from './showtimes.service';
import { Showtime } from './showtime.entity';
import { Module_Movies } from '../movies/movies.module';

@Module({
  
  imports: [
    TypeOrmModule.forFeature([Showtime]),
    Module_Movies, 
  ],
  
  controllers: [Controller_Showtime],
  providers: [Service_Showtimes],
  exports: [Service_Showtimes],

})

export class Module_Showtimes {}