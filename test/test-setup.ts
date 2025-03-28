import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

async function globalSetup() 
{
  const app = await NestFactory.create(AppModule);
  const connection = app.get(DataSource);

  await connection.synchronize(true);
  await app.close();
}

export default globalSetup;
