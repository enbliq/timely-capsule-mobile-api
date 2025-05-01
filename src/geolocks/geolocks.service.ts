import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { Geolock, type GeolockDocument } from '../models/geolock.schema';
import type { CreateGeolockDto } from './dto/create-geolock.dto';
import type { UpdateGeolockDto } from './dto/update-geolock.dto';

@Injectable()
export class GeolocksService {
  constructor(
    @InjectModel(Geolock.name) private geolockModel: Model<GeolockDocument>,
  ) {}

  async create(createGeolockDto: CreateGeolockDto): Promise<Geolock> {
    const createdGeolock = new this.geolockModel(createGeolockDto);
    return createdGeolock.save();
  }

  async findAll(): Promise<Geolock[]> {
    return this.geolockModel.find().exec();
  }

  async findOne(id: string): Promise<Geolock> {
    const geolock = await this.geolockModel.findById(id).exec();
    if (!geolock) {
      throw new NotFoundException(`Geolock with ID ${id} not found`);
    }
    return geolock;
  }

  async findByCapsule(capsuleId: string): Promise<Geolock> {
    const geolock = await this.geolockModel.findOne({ capsuleId }).exec();
    if (!geolock) {
      throw new NotFoundException(`Geolock for capsule ${capsuleId} not found`);
    }
    return geolock;
  }

  async update(
    id: string,
    updateGeolockDto: UpdateGeolockDto,
  ): Promise<Geolock> {
    const updatedGeolock = await this.geolockModel
      .findByIdAndUpdate(id, updateGeolockDto, { new: true })
      .exec();
    if (!updatedGeolock) {
      throw new NotFoundException(`Geolock with ID ${id} not found`);
    }
    return updatedGeolock;
  }

  async remove(id: string): Promise<Geolock> {
    const deletedGeolock = await this.geolockModel.findByIdAndDelete(id).exec();
    if (!deletedGeolock) {
      throw new NotFoundException(`Geolock with ID ${id} not found`);
    }
    return deletedGeolock;
  }
}
