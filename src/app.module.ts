import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Module_Movies } from './movies/movies.module';
import { Module_Showtimes } from './showtimes/showtimes.module';
import { Modlue_Tickets } from './tickets/tickets.module';

@Module({
  
  imports: [

    // --------- ORM -------------------------------------------

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'popcorn-palace',
      password: 'popcorn-palace',
      database: 'popcorn-palace',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true, // Enable logging to see connection details
      connectTimeoutMS: 5000, //  timeout
    }),

    // --------- our modules -------------------------------------------

    Module_Movies,
    Module_Showtimes,
    Modlue_Tickets,
  ],

  controllers: [AppController],
  
  providers: [AppService],
  
})
export class AppModule {}