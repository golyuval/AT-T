import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Controller_Movies } from './movies.controller';
import { Service_Movies } from './movies.service';
import { Movie } from './movie.entity';

@Module({

  imports: [TypeOrmModule.forFeature([Movie])],

  controllers: [Controller_Movies],
  providers: [Service_Movies],
  exports: [Service_Movies],

})

export class Module_Movies {}