import { createE2EApp } from './test-setup';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';

describe('Movies E2E', () => {

    let app: INestApplication;
    let createdMovieId: number;
    let createdMovieTitle: string;
    let createdShowtimeId: number;

    beforeAll(async () => (app = await createE2EApp()));

    afterAll(() => app.close());

    // ----------- movies ---------------------------------------------------------------
  
    describe('Movies', () => 
    {
  
      // ----- POST /movies ------------------
  
      it('POST /movies - should create a new movie', async () => {
        const createMovieDto = {
          title: 'Test Movie',
          genre: 'Action',
          duration: 120,
          rating: 8.7,
          releaseYear: 2023,
        };
  
        const response = await request(app.getHttpServer())
          .post('/movies')
          .send(createMovieDto)
          .expect(201);
  
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toEqual(createMovieDto.title);
        
        createdMovieId = response.body.id;
        createdMovieTitle = response.body.title;
      });
  
      // ----- GET /movies/all ------------------
  
      it('GET /movies/all - should return all movies', async () => {
  
        const response = await request(app.getHttpServer())
          .get('/movies/all')
          .expect(200);
  
        expect(Array.isArray(response.body)).toBe(true);
        const movie = response.body.find((m) => m.title === 'Test Movie');
  
        expect(movie).toBeDefined();
      });
  
      // ----- POST /movies/update/:movieTitle ------------------
  
      it('POST /movies/update/:movieTitle - should update a movie by title', async () => {
        
        const updateDto = {
          genre: 'Drama',
          duration: 130,
        };
  
        const response = await request(app.getHttpServer())
          .post(`/movies/update/${encodeURIComponent(createdMovieTitle)}`)
          .send(updateDto)
          .expect(201);
  
        expect(response.body.genre).toEqual(updateDto.genre);
        expect(response.body.duration).toEqual(updateDto.duration);
      });
  
      // ----- DELETE /movies/:movieTitle ------------------
  
      it('DELETE /movies/:movieTitle - should delete a movie by title', async () => {
        
        const createMovieDto = {
          title: 'Delete Movie',
          genre: 'Horror',
          duration: 100,
          rating: 6.5,
          releaseYear: 2022,
        };
  
        const createResponse = await request(app.getHttpServer())
          .post('/movies')
          .send(createMovieDto)
          .expect(201);
  
        const movieTitle = createResponse.body.title;
  
        await request(app.getHttpServer())
          .delete(`/movies/${encodeURIComponent(movieTitle)}`)
          .expect(200);
  
        const fetchResponse = await request(app.getHttpServer())
          .get('/movies/all')
          .expect(200);
  
        const deletedMovie = fetchResponse.body.find((m) => m.title === movieTitle);
        expect(deletedMovie).toBeUndefined();
      });
    });

    describe('POST /movies invalid payloads', () => {
        const url = '/movies';
    
        it('extra prop', () =>
          request(app.getHttpServer())
            .post(url)
            .send({ title: 'T', genre: 'G', duration: 90, rating: 5, releaseYear: 2020, extra: true })
            .expect(400)
        );
    
        it('empty title', () =>
          request(app.getHttpServer())
            .post(url)
            .send({ title: '', genre: 'G', duration: 90, rating: 5, releaseYear: 2020 })
            .expect(400)
        );
    
        it('genre too long', () =>
          request(app.getHttpServer())
            .post(url)
            .send({ title: 'T', genre: 'X'.repeat(51), duration: 90, rating: 5, releaseYear: 2020 })
            .expect(400)
        );
    
        it('duration out of range', () =>
          request(app.getHttpServer())
            .post(url)
            .send({ title: 'T', genre: 'G', duration: 601, rating: 5, releaseYear: 2020 })
            .expect(400)
        );
    
        it('rating wrong type', () =>
          request(app.getHttpServer())
            .post(url)
            .send({ title: 'T', genre: 'G', duration: 100, rating: 'bad', releaseYear: 2020 })
            .expect(400)
        );
    
        it('releaseYear out of range', () =>
          request(app.getHttpServer())
            .post(url)
            .send({ title: 'T', genre: 'G', duration: 100, rating: 8, releaseYear: 1800 })
            .expect(400)
        );
  
      });
});
