
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Showtime } from './showtime.entity';
import { DTO_showtime_create } from './DTO/create-showtime.dto';
import { DTO_showtime_update } from './DTO/update-showtime.dto';
import { Service_Movies } from '../movies/movies.service';

@Injectable()
export class Service_Showtimes 
{

    // -------- constructor ---------------------------------------------------------------------------------------

    constructor(
        @InjectRepository(Showtime)
        private showtime_repo: Repository<Showtime>,
        private movies_service: Service_Movies,
    ) {}

    // -------- overlapping check ---------------------------------------------------------------------------------

    private async check_overlap(theater: string, start: Date, end: Date, ID?: number, ): Promise<void> 
    {

        const queryBuilder = this.showtime_repo.createQueryBuilder('showtime')
            .where('showtime.theater = :theater', { theater })
            .andWhere(
            '((:startTime >= showtime.start_time AND :startTime < showtime.end_time) OR ' +
            '(:endTime > showtime.start_time AND :endTime <= showtime.end_time) OR ' +
            '(:startTime <= showtime.start_time AND :endTime >= showtime.end_time))',
            { startTime: start, endTime: end });
            
        if (ID) 
        {
            queryBuilder.andWhere('showtime.id != :id', { id: ID });
        }
    
        const overlaps = await queryBuilder.getMany();
    
        if (overlaps.length > 0) 
        {
            throw new ConflictException(`showtimes overlapping in theater "${theater}"`,);
        }
    }

    // -------- create --------------------------------------------------------------------------------------------

    async create(create_DTO: DTO_showtime_create): Promise<Showtime> 
    {
        // movie existance check
        await this.movies_service.find_by_id(create_DTO.movie_id);

        // overlapping showtimes check
        await this.check_overlap(
            create_DTO.theater,
            create_DTO.start_time,
            create_DTO.end_time,
        );

        // create and save
        return this.showtime_repo.save(create_DTO);
    }

    // -------- remove --------------------------------------------------------------------------------------------

    async remove(ID: number): Promise<void> 
    {
        const result = await this.showtime_repo.delete(ID);
    
        if (result.affected === 0) 
        {
            throw new NotFoundException(`showtime (ID ${ID}) not found`);
        }
    }

    // -------- update --------------------------------------------------------------------------------------------

    async update(ID: number, update_DTO: DTO_showtime_update): Promise<Showtime> 
    {
        const showtime = await this.find_by_id(ID);

        // movie existance check
        if (update_DTO.movie_id && update_DTO.movie_id !== showtime.movie_id) {
            await this.movies_service.find_by_id(update_DTO.movie_id);
        }

        // overlap showtime check (if field updated)
        if (update_DTO.theater || update_DTO.start_time || update_DTO.end_time) 
        {
            await this.check_overlap(
            update_DTO.theater || showtime.theater,
            update_DTO.start_time || showtime.start_time,
            update_DTO.end_time || showtime.end_time,
            ID, );
        }

        // updated showtime
        const updated = {
            ...showtime,
            ...update_DTO,
        };

        return this.showtime_repo.save(updated);
    }

    // -------- find ----------------------------------------------------------------------------------------------

    async find_all(): Promise<Showtime[]> 
    {
        return this.showtime_repo.find();
    }

    async find_by_id(ID: number): Promise<Showtime> 
    {
        const showtime = await this.showtime_repo.findOne({ where: { id: ID } });
        
        if (!showtime) 
        {
            throw new NotFoundException(`showtime (ID ${ID}) not found`);
        }
        
        return showtime;
    }




}