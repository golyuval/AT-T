import { createE2EApp, seedMovie, seedShowtime } from './test-setup';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';

describe('Bookings E2E', () => {

    let app: INestApplication;
    let createdMovieId: number;
    let createdMovieTitle: string;
    let createdShowtimeId: number;

    beforeAll(async () => {
            app = await createE2EApp();
            createdMovieId = await seedMovie(app);
            createdShowtimeId = await seedShowtime(app, createdMovieId);
    });

    afterAll(() => app.close());

    describe('Valid Bookings', () => {

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

        
        describe('Invalid booking (POST /bookings payloads)', () => {
      
            const url = '/bookings';
        
            it('extra prop', () =>
              request(app.getHttpServer())
                .post(url)
                .send({ showtimeId: 1, seatNumber: 1, userId: 'u', foo: 'bar' })
                .expect(400)
            );
        
            it('showtimeId <= 0', () =>
              request(app.getHttpServer())
                .post(url)
                .send({ showtimeId: 0, seatNumber: 1, userId: 'u' })
                .expect(400)
            );
        
            it('seatNumber < 1', () =>
              request(app.getHttpServer())
                .post(url)
                .send({ showtimeId: 1, seatNumber: 0, userId: 'u' })
                .expect(400)
            );
        
            it('empty userId', () =>
              request(app.getHttpServer())
                .post(url)
                .send({ showtimeId: 1, seatNumber: 2, userId: '' })
                .expect(400)
            );
      
          });
});
