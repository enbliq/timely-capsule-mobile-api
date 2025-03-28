import { IsNotEmpty, IsOptional } from 'class-validator';
import { Capsule } from '../entities/capsule.entity';

export class PaginationDto {
    @IsOptional()
    page: number = 1;   //set deffault page to page 1

    @IsOptional()
    limits: number = 10;  //set default limit to 10 capsules 
}
