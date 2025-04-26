
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Movie } from '../movies/movie.entity';


// --------- 2.2.1 requirements 

@Entity()
export class Showtime 
{    

    // -------- Primary Key ----------------------------------------------------------

    @PrimaryGeneratedColumn()
    id: number;

    // -------- Foreign Key ------------------------------------------

    @Column()
    movieId: number;

    @ManyToOne(() => Movie, { eager: true })
    @JoinColumn({ name: 'movieId' })
    movie: Movie;

    // -------- Other Columns  ------------------------------------------

    @Column()
    theater: string;

    @Column({ type: 'timestamp' })
    startTime: Date;

    @Column({ type: 'timestamp' })
    endTime: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

}