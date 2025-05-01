import { NotFoundException } from '@nestjs/common';
import type { Fund } from '../models/fund.schema';
import type { CreateFundDto } from './dto/create-fund.dto';
import type { UpdateFundDto } from './dto/update-fund.dto';

export class FundsService {
  constructor(private fundModel) {}

  async create(createFundDto: CreateFundDto): Promise<Fund> {
    const createdFund = new this.fundModel(createFundDto);
    return createdFund.save();
  }

  async findAll(): Promise<Fund[]> {
    return this.fundModel.find().exec();
  }

  async findOne(id: string): Promise<Fund> {
    const fund = await this.fundModel.findById(id).exec();
    if (!fund) {
      throw new NotFoundException(`Fund with ID ${id} not found`);
    }
    return fund;
  }

  async findByCapsule(capsuleId: string): Promise<Fund> {
    const fund = await this.fundModel.findOne({ capsuleId }).exec();
    if (!fund) {
      throw new NotFoundException(`Fund for capsule ${capsuleId} not found`);
    }
    return fund;
  }

  async update(id: string, updateFundDto: UpdateFundDto): Promise<Fund> {
    const updatedFund = await this.fundModel
      .findByIdAndUpdate(id, updateFundDto, { new: true })
      .exec();
    if (!updatedFund) {
      throw new NotFoundException(`Fund with ID ${id} not found`);
    }
    return updatedFund;
  }

  async remove(id: string): Promise<Fund> {
    const deletedFund = await this.fundModel.findByIdAndDelete(id).exec();
    if (!deletedFund) {
      throw new NotFoundException(`Fund with ID ${id} not found`);
    }
    return deletedFund;
  }
}
