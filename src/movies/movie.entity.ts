import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

// --------- 2.2.1 requirements 

@Entity()
export class Movie 
{
    // --- Primary Key -------------------------------------------

    @PrimaryGeneratedColumn()
    id: number;

    // --- Other Columns  ----------------------------------------

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