// import { IsOptional, IsString, IsDate, IsEnum, IsBoolean, IsNumber } from 'class-validator';
// import { Type } from 'class-transformer';

// enum CapsuleStatus {
//   ACTIVE = 'active',
//   INACTIVE = 'inactive',
//   MAINTENANCE = 'maintenance'
// }

// export class UpdateCapsuleDto {
//   @IsOptional()
//   @IsString()
//   name?: string;

//   @IsOptional()
//   @IsString()
//   description?: string;

//   @IsOptional()
//   @IsEnum(CapsuleStatus)
//   status?: CapsuleStatus;

//   @IsOptional()
//   @IsDate()
//   @Type(() => Date)
//   manufactureDate?: Date;

//   @IsOptional()
//   @IsDate()
//   @Type(() => Date)
//   lastMaintenanceDate?: Date;

//   @IsOptional()
//   @IsBoolean()
//   isActive?: boolean;

//   @IsOptional()
//   @IsNumber()
//   version?: number;

//   @IsOptional()
//   @IsNumber()
//   capacity?: number;

//   @IsOptional()
//   @IsString()
//   location?: string;

//   @IsOptional()
//   @IsDate()
//   @Type(() => Date)
//   nextScheduledMaintenance?: Date;
// }