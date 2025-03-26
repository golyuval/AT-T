import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Showtime } from '../showtimes/showtime.entity';

@Entity()
export class Ticket 
{
    
    // -------- ID ----------------------------------------------------------

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    showtime_id: number;

    // -------- combined features ----------------------------------------------------------

    @ManyToOne(() => Showtime, { eager: true })
    @JoinColumn({ name: 'showtime_id' })
    showtime: Showtime;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    seat: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    time: Date;

}