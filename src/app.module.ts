// File: app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module_Movies } from './movies/movies.module';
import { Module_Showtimes } from './showtimes/showtimes.module';
import { Module_Bookings } from './bookings/bookings.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'popcorn-palace',
      password: 'popcorn-palace',
      database: 'popcorn-palace',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: process.env.NODE_ENV !== 'test', // disable logging during tests
      connectTimeoutMS: 5000,
    }),
    Module_Movies,
    Module_Showtimes,
    Module_Bookings,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
