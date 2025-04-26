// import { NestFactory } from '@nestjs/core';
// import { AppModule } from '../src/app.module';
// import { DataSource } from 'typeorm';

// async function globalSetup() 
// {
//   const app = await NestFactory.create(AppModule);
//   const connection = app.get(DataSource);

//   await connection.synchronize(true);
//   await app.close();
// }

// export default globalSetup;

// test/test-setup.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export async function createE2EApp() 
{

  // reset DB
  const temp = await NestFactory.create(AppModule);
  const ds = temp.get(DataSource);
  await ds.synchronize(true);
  await temp.close();

  // real app instance
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist:true, forbidNonWhitelisted:true, transform:true }));
  await app.init();
  return app;
}

export default createE2EApp;

export async function seedMovie(app: INestApplication) {
  const res = await request(app.getHttpServer())
    .post('/movies')
    .send({ title:'Seed', genre:'X', duration:80, rating:5, releaseYear:2025 })
    .expect(201);
  return res.body.id;
}

export async function seedShowtime(app: INestApplication, movieId: number) {
  const now = Date.now();
  const start = new Date(now + 3600_000).toISOString();
  const end   = new Date(now + 7200_000).toISOString();
  const res = await request(app.getHttpServer())
    .post('/showtimes')
    .send({ movieId, theater:'T', startTime:start, endTime:end, price:8 })
    .expect(201);
  return res.body.id;
}

