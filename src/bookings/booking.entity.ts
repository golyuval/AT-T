import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Showtime } from '../showtimes/showtime.entity';

// --------- 2.2.1 requirements 

@Entity()
export class Booking {

  // --- Primary Key -------------------------------------------

  @PrimaryGeneratedColumn('uuid')
  bookingId: string;

  // --- Foreign Key -------------------------------------------

  @Column()
  showtimeId: number;

  @ManyToOne(() => Showtime, { eager: true })
  @JoinColumn({ name: 'showtimeId' })
  showtime: Showtime;

  // --- Other properties --------------------------------------

  @Column()
  userId: string;

  @Column('int')
  seatNumber: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  time: Date;
}
