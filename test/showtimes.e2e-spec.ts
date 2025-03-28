import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Showtimes Endpoints', () => 
{

    // ----------- init ----------------------------------------------------------------

    let app: INestApplication;
    let movie_ID: number;
    let showtime_ID: number;

    const movie = {
        title: 'The Matrix',
        genre: 'Sci-Fi',
        duration: 136,
        rating: 'R',
        release_year: 1999,
    };

    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    // ----------- before ----------------------------------------------------------------

    beforeAll(async () => {
        const testing_module = await Test.createTestingModule({
        imports: [AppModule],
        }).compile();

        app = testing_module.createNestApplication();
        await app.init();

        // Create a movie to associate with the showtime tests
        await request(app.getHttpServer())
            .post('/movies')
            .send(movie)
            .expect(201)
            .then(response => {
                movie_ID = response.body.id;
            });
    });

    // ----------- after ----------------------------------------------------------------

    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });
    
    // ----------- post ----------------------------------------------------------------

    it('POST /showtimes - should create a new showtime', () => {
        const showtimeData = {
            movie_id: movie_ID,
            theater: 'Main Hall',
            start_time: now.toISOString(),
            end_time: twoHoursLater.toISOString(),
            price: 10.50,
        };
        return request(app.getHttpServer())
            .post('/showtimes')
            .send(showtimeData)
            .expect(201)
            .then(response => {
                expect(response.body.id).toBeDefined();
                showtime_ID = response.body.id;
            });
    });

    // ----------- get ----------------------------------------------------------------

    it('GET /showtimes - should return an array of showtimes', () => {
        return request(app.getHttpServer())
            .get('/showtimes')
            .expect(200)
            .then(response => {
                expect(Array.isArray(response.body)).toBe(true);
            });
    });

    it('GET /showtimes/:id - should return showtime details', () => {
        return request(app.getHttpServer())
            .get(`/showtimes/${showtime_ID}`)
            .expect(200)
            .then(response => {
                expect(response.body.theater).toEqual('Main Hall');
            });
    });

    // ----------- patch ----------------------------------------------------------------

    it('PATCH /showtimes/:id - should update a showtime', () => {
        const updateData = { theater: 'VIP Hall' };
        return request(app.getHttpServer())
            .patch(`/showtimes/${showtime_ID}`)
            .send(updateData)
            .expect(200)
            .then(response => {
                expect(response.body.theater).toEqual(updateData.theater);
            });
    });

    // ----------- delete ----------------------------------------------------------------

    it('DELETE /showtimes/:id - should delete a showtime', () => {
        return request(app.getHttpServer())
            .delete(`/showtimes/${showtime_ID}`)
            .expect(204);
    });
});
