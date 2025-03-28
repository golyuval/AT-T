
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';
import { Controller_Tickets } from './tickets.controller';
import { Service_Tickets } from './tickets.service';
import { Module_Showtimes } from '../showtimes/showtimes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    Module_Showtimes,  // now Service_Showtimes is available for injection
  ],
  controllers: [Controller_Tickets],
  providers: [Service_Tickets],
})
export class Module_Tickets {}
