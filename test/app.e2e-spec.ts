import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
// Adjust the import below to point to your main app module that imports all feature modules.
import { AppModule } from './../src/app.module';

describe('Popcorn Palace E2E', () => 
{

  // ----------- prep ---------------------------------------------------------------

  let app: INestApplication;
  let createdMovieId: number;
  let createdMovieTitle: string;
  let createdShowtimeId: number;

  // ----------- before ------------------

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    // Use global validation pipe as in your project
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  // ----------- after ------------------

  afterAll(async () => {
    if(app){
      await app.close();
    }
  });

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

  // ----------- bookings ---------------------------------------------------------------

  describe('Bookings', () => {
    it('POST /bookings - should create a new booking', async () => {

      const createBookingDto = {
        showtimeId: createdShowtimeId,
        seatNumber: 10,
        userId: 'user123',
      };

      const response = await request(app.getHttpServer())
        .post('/bookings')
        .send(createBookingDto)
        .expect(201);
        
      expect(response.body).toHaveProperty('bookingId');
    });

    it('POST /bookings - should not allow booking the same seat twice', async () => {
      const createBookingDto = {
        showtimeId: createdShowtimeId,
        seatNumber: 11,
        userId: 'userA',
      };

      // First booking should succeed.
      await request(app.getHttpServer())
        .post('/bookings')
        .send(createBookingDto)
        .expect(201);

      // Second booking should fail
      await request(app.getHttpServer())
        .post('/bookings')
        .send(createBookingDto)
        .expect(409);
    });
  });

});
