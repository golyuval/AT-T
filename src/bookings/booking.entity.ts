import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Showtime } from '../showtimes/showtime.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  bookingId: string;

  @Column()
  showtimeId: number;

  @ManyToOne(() => Showtime, { eager: true })
  @JoinColumn({ name: 'showtimeId' })
  showtime: Showtime;

  @Column()
  userId: string;

  @Column('int')
  seatNumber: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  time: Date;
}
