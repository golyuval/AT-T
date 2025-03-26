import { Module } from '@nestjs/common';
import { Controller_Tickets } from './tickets.controller';
import { Service_Tickets } from './tickets.service';

@Module({
  controllers: [Controller_Tickets],
  providers: [Service_Tickets]
})
export class Modlue_Tickets {}
