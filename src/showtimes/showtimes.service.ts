
import { ConflictException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Showtime } from './showtime.entity';
import { DTO_showtime_create } from './DTO/create-showtime.dto';
import { DTO_showtime_update } from './DTO/update-showtime.dto';
import { Service_Movies } from '../movies/movies.service';

// requirement 2.2 done
// requirement 3.1 done (overlapping and ID validations + informative errors)


function validate_ID(id: number): void {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid showtime ID provided.');
    }
}
  
function validate_DTO(dto: any, errorMessage: string): void {
    if (!dto || Object.keys(dto).length === 0) {
      throw new BadRequestException(errorMessage);
    }
}

  
@Injectable()
export class Service_Showtimes 
{

    // -------- constructor ---------------------------------------------------------------------------------------

    constructor(
        @InjectRepository(Showtime)
        private showtime_repo: Repository<Showtime>,
        private movies_service: Service_Movies,
    ) {}

    // -------- overlapping check (requirement 2.2.5 - constraint) ---------------------------------------------------------------------------------

    private async check_overlap(theater: string, start: Date, end: Date, ID?: number, ): Promise<void> 
    {

        const queryBuilder = this.showtime_repo.createQueryBuilder('showtime')
            .where('showtime.theater = :theater', { theater })
            .andWhere(
            '((:startTime >= showtime.startTime AND :startTime < showtime.endTime) OR ' +
            '(:endTime > showtime.startTime AND :endTime <= showtime.endTime) OR ' +
            '(:startTime <= showtime.startTime AND :endTime >= showtime.endTime))',
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

    // -------- create (requirement 2.2.1) --------------------------------------------------------------------------------------------

    async create(create_DTO: DTO_showtime_create): Promise<Showtime> 
    {
        validate_DTO(create_DTO, 'Showtime data must not be empty.');
        await this.movies_service.find_by_id(create_DTO.movieId);

        await this.check_overlap(
            create_DTO.theater,
            create_DTO.startTime,
            create_DTO.endTime,
        );

        return this.showtime_repo.save(create_DTO);
    }

    // -------- remove (requirement 2.2.3) --------------------------------------------------------------------------------------------

    async remove(ID: number): Promise<void> 
    {
        validate_ID(ID);
        const result = await this.showtime_repo.delete(ID);
    
        if (result.affected === 0) 
        {
            throw new NotFoundException(`showtime (ID ${ID}) not found`);
        }
    }

    // -------- update (requirement 2.2.2) --------------------------------------------------------------------------------------------

    async update(ID: number, update_DTO: DTO_showtime_update): Promise<Showtime> 
    {
        validate_ID(ID);
        validate_DTO(update_DTO, 'Showtime data must not be empty.');
        const showtime = await this.find_by_id(ID);

        // movie existance check
        if (update_DTO.movieId && update_DTO.movieId !== showtime.movieId) {
            await this.movies_service.find_by_id(update_DTO.movieId);
        }

        // overlap showtime check (if field updated)
        if (update_DTO.theater || update_DTO.startTime || update_DTO.endTime) 
        {
            await this.check_overlap(
            update_DTO.theater || showtime.theater,
            update_DTO.startTime || showtime.startTime,
            update_DTO.endTime || showtime.endTime,
            ID, );
        }

        // updated showtime
        const updated = {
            ...showtime,
            ...update_DTO,
        };

        return this.showtime_repo.save(updated);
    }

    // -------- find (requirement 2.2.4) ----------------------------------------------------------------------------------------------

    async find_all(): Promise<Showtime[]> 
    {
        return this.showtime_repo.find();
    }

    async find_by_id(ID: number): Promise<Showtime> 
    {
        validate_ID(ID);
        const showtime = await this.showtime_repo.findOne({ where: { id: ID } });
        
        if (!showtime) 
        {
            throw new NotFoundException(`showtime (ID ${ID}) not found`);
        }
        
        return showtime;
    }




}