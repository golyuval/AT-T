
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
    @JoinColumn({ name: 'movieId' })
    movie: Movie;

    @Column()
    movieId: number;

    @Column()
    theater: string;

    @Column({ type: 'timestamp' })
    startTime: Date;

    @Column({ type: 'timestamp' })
    endTime: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

}