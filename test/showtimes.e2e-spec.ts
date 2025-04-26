import { createE2EApp, seedMovie, seedShowtime } from './test-setup';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';

describe('Movies E2E', () => {

    let app: INestApplication;
    let createdMovieId: number;
    let createdMovieTitle: string;
    let createdShowtimeId: number;

    beforeAll(async () => {
        app = await createE2EApp();
        createdMovieId = await seedMovie(app);
        //createdShowtimeId = await seedShowtime(app, movieId);
    });

    afterAll(() => app.close());

  
    // ----------- showtimes ---------------------------------------------------------------
  
    describe('Showtimes', () => 
    {
      
      // ----- POST /showtimes ------------------
  
      it('POST /showtimes - should create a new showtime', async () => {
  
        const now = new Date();
        const startTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour later
        const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
  
        const createShowtimeDto = {
          movieId: createdMovieId,
          price: 15.5,
          theater: 'Theater 1',
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        };
  
        const response = await request(app.getHttpServer())
          .post('/showtimes')
          .send(createShowtimeDto)
          .expect(201);
  
        expect(response.body).toHaveProperty('id');
        expect(response.body.theater).toEqual(createShowtimeDto.theater);
        createdShowtimeId = response.body.id;
      });
  
      // ----- GET /showtimes/:showtimeId ------------------
  
      it('GET /showtimes/:showtimeId - should fetch a showtime by id', async () => {
  
        const response = await request(app.getHttpServer())
          .get(`/showtimes/${createdShowtimeId}`)
          .expect(200);
  
        expect(response.body.id).toEqual(createdShowtimeId);
      });
  
      // ----- POST /showtimes/update/:showtimeId ------------------
  
      it('POST /showtimes/update/:showtimeId - should update a showtime', async () => {
        
        const updateDto = {
          theater: 'Theater 2',
          price: 20.0,
        };
  
        const response = await request(app.getHttpServer())
          .post(`/showtimes/update/${createdShowtimeId}`)
          .send(updateDto)
          .expect(201);
  
        expect(response.body.theater).toEqual(updateDto.theater);
        expect(response.body.price).toEqual(updateDto.price);
      });
  
      // ----- DELETE /showtimes/:showtimeId  ------------------
  
      it('DELETE /showtimes/:showtimeId - should delete a showtime', async () => {
  
        const now = new Date();
        const startTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
        const endTime = new Date(now.getTime() + 4 * 60 * 60 * 1000);
  
        const createShowtimeDto = {
          movieId: createdMovieId,
          price: 12.0,
          theater: 'Theater Delete',
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        };
  
        const createResponse = await request(app.getHttpServer())
          .post('/showtimes')
          .send(createShowtimeDto)
          .expect(201);
  
        const showtimeIdToDelete = createResponse.body.id;
  
        await request(app.getHttpServer())
          .delete(`/showtimes/${showtimeIdToDelete}`)
          .expect(200);
  
        await request(app.getHttpServer())
          .get(`/showtimes/${showtimeIdToDelete}`)
          .expect(404);
      });
    });

    describe('POST /showtimes invalid payloads', () => {

        const url = '/showtimes';
        const now = new Date();
        const start = new Date(now.getTime() + 3600_000).toISOString();
        const end   = new Date(now.getTime() + 7200_000).toISOString();
    
        it('extra property', () =>
          request(app.getHttpServer())
            .post(url)
            .send({ movieId: 1, theater: 'T', startTime: start, endTime: end, price: 10, foo: 'bar' })
            .expect(400)
        );
    
        it('movieId <= 0', () =>
          request(app.getHttpServer())
            .post(url)
            .send({ movieId: 0, theater: 'T', startTime: start, endTime: end, price: 10 })
            .expect(400)
        );
    
        it('price negative', () =>
          request(app.getHttpServer())
            .post(url)
            .send({ movieId: 1, theater: 'T', startTime: start, endTime: end, price: -5 })
            .expect(400)
        );
    
        it('invalid dates', () =>
          request(app.getHttpServer())
            .post(url)
            .send({ movieId: 1, theater: 'T', startTime: 'nope', endTime: 'nope', price: 10 })
            .expect(400)
        );
      });
  
    
    
});
