
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Movie } from '../movies/movie.entity';

@Entity()
export class Showtime 
{    

    // -------- ID ----------------------------------------------------------

    @PrimaryGeneratedColumn()
    id: number;

    // -------- 2.2.1 requirements ------------------------------------------

    @ManyToOne(() => Movie, { eager: true })
    @JoinColumn({ name: 'movie_id' })
    movie: Movie;

    @Column()
    movie_id: number;

    @Column()
    theater: string;

    @Column({ type: 'timestamp' })
    start_time: Date;

    @Column({ type: 'timestamp' })
    end_time: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

}