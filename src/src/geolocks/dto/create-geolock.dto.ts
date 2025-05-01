import { IsEnum, IsMongoId, IsNumber, IsObject, IsOptional, IsString } from "class-validator"
import type { ObjectId } from "mongoose"
import type { GeolockType } from "../../models/geolock.schema"

export class CoordinatesDto {
  @IsNumber()
  lat: number

  @IsNumber()
  lng: number

  @IsNumber()
  radiusMeters: number
}

export class CreateGeolockDto {
  @IsMongoId()
  capsuleId: ObjectId

  @IsEnum(["country", "city", "radius"])
  type: GeolockType

  @IsString()
  @IsOptional()
  countryCode?: string

  @IsString()
  @IsOptional()
  cityName?: string

  @IsObject()
  @IsOptional()
  coordinates?: CoordinatesDto
}
