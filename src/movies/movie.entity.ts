import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';


@Entity()
export class Movie 
{
    // -------- ID ----------------------------------------------------------

    @PrimaryGeneratedColumn()
    id: number;

    // -------- 2.1.1 requirements ------------------------------------------

    @Column()
    title: string;

    @Column()
    genre: string;

    @Column()
    duration: number;

    @Column({ type: 'decimal', precision: 3, scale: 1 })
    rating: number;

    @Column()
    releaseYear: number;
}