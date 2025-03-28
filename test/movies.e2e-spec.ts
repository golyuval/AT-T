import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Movies Endpoints', () => 
{
    // ----------- init ----------------------------------------------------------------

    let app: INestApplication;
    let movie_ID: number;
    const movie = {
        title: 'Inception',
        genre: 'Sci-Fi',
        duration: 148,
        rating: 'PG-13',
        release_year: 2010,
    };

    // ----------- before ----------------------------------------------------------------

    beforeAll(async () => {
        const testing_module = await Test.createTestingModule({
            imports: [AppModule],
            }).compile();

        app = testing_module.createNestApplication();
        await app.init();
    });

    // ----------- after ----------------------------------------------------------------

    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });
    
    // ----------- post ----------------------------------------------------------------

    it('POST /movies - should create a new movie', () => {
        return request(app.getHttpServer())
            .post('/movies')
            .send(movie)
            .expect(201)
            .then(response => {
                expect(response.body.id).toBeDefined();
                movie_ID = response.body.id;
            });
    });

    // ----------- get ----------------------------------------------------------------

    it('GET /movies - should return an array of movies', () => {
        return request(app.getHttpServer())
            .get('/movies')
            .expect(200)
            .then(response => {
                expect(Array.isArray(response.body)).toBe(true);
                expect(response.body.length).toBeGreaterThan(0);
            });
    });

    it('GET /movies/:id - should return movie details', () => {
        return request(app.getHttpServer())
            .get(`/movies/${movie_ID}`)
            .expect(200)
            .then(response => {
                expect(response.body.title).toEqual(movie.title);
            });
    });

    // ----------- patch ----------------------------------------------------------------

    it('PATCH /movies/:id - should update a movie', () => {
        const updateData = { genre: 'Action' };
        return request(app.getHttpServer())
            .patch(`/movies/${movie_ID}`)
            .send(updateData)
            .expect(200)
            .then(response => {
                expect(response.body.genre).toEqual(updateData.genre);
            });
    });

    // ----------- delete ----------------------------------------------------------------

    it('DELETE /movies/:id - should delete a movie', () => {
        return request(app.getHttpServer())
            .delete(`/movies/${movie_ID}`)
            .expect(204);
    });
});
