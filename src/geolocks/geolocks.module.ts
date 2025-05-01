import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GeolocksService } from './geolocks.service';
import { GeolocksController } from './geolocks.controller';
import { Geolock, GeolockSchema } from '../models/geolock.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Geolock.name, schema: GeolockSchema }]),
  ],
  controllers: [GeolocksController],
  providers: [GeolocksService],
  exports: [GeolocksService],
})
export class GeolocksModule {}
