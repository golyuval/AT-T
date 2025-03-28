import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Tickets Endpoints', () => 
{

    // ----------- init ----------------------------------------------------------------

    let app: INestApplication;
    let movie_ID: number;
    let showtime_ID: number;
    let ticket_ID: number;

    const movie = {
        title: 'Interstellar',
        genre: 'Sci-Fi',
        duration: 169,
        rating: 'PG-13',
        release_year: 2014,
    };

    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    // ----------- before ----------------------------------------------------------------

    beforeAll(async () => 
    {
        const testing_module = await Test.createTestingModule({
            imports: [AppModule],
            }).compile();

        app = testing_module.createNestApplication();
        await app.init();

        // Create a movie to associate with the tickets
        await request(app.getHttpServer())
            .post('/movies')
            .send(movie)
            .expect(201)
            .then(response => {
                movie_ID = response.body.id;
        });

        // Create a showtime for the movie
        const showtimeData = {
            movie_id: movie_ID,
            theater: 'Screen 1',
            start_time: now.toISOString(),
            end_time: twoHoursLater.toISOString(),
            price: 12.00,
        };

        await request(app.getHttpServer())
            .post('/showtimes')
            .send(showtimeData)
            .expect(201)
            .then(response => {
                showtime_ID = response.body.id;
            });
    });

    // ----------- after ----------------------------------------------------------------

    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });

    // ----------- post ----------------------------------------------------------------
    
    it('POST /tickets - should create a ticket booking', () => {
        const ticketData = {
            showtime_id: showtime_ID,
            name: 'John Doe',
            email: 'john@example.com',
            seat: 'A1',
        };

        return request(app.getHttpServer())
            .post('/tickets')
            .send(ticketData)
            .expect(201)
            .then(response => {
                expect(response.body.id).toBeDefined();
                ticket_ID = response.body.id;
            });
    });

    it('POST /tickets - should not allow booking the same seat twice', async () => {
        const ticketData = {
            showtime_id: showtime_ID,
            name: 'Jane Doe',
            email: 'jane@example.com',
            seat: 'A1',
        };

        await request(app.getHttpServer())
            .post('/tickets')
            .send(ticketData)
            .expect(409);
    });

    // ----------- get ----------------------------------------------------------------

    it('GET /tickets - should return an array of tickets', () => {
        return request(app.getHttpServer())
            .get('/tickets')
            .expect(200)
            .then(response => {
                expect(Array.isArray(response.body)).toBe(true);
            });
    });

    it('GET /tickets/:id - should return ticket details', () => {
        return request(app.getHttpServer())
            .get(`/tickets/${ticket_ID}`)
            .expect(200)
            .then(response => {
                expect(response.body.name).toEqual('John Doe');
            });
    });

    it('GET /tickets?showtime_id= - should return tickets for a given showtime', () => {
        return request(app.getHttpServer())
            .get(`/tickets?showtime_id=${showtime_ID}`)
            .expect(200)
            .then(response => {
                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body.length).toBeGreaterThan(0);
            });
    });

    // ----------- delete ----------------------------------------------------------------

    it('DELETE /tickets/:id - should delete a ticket', () => {
        return request(app.getHttpServer())
            .delete(`/tickets/${ticket_ID}`)
            .expect(204);
    });
});
