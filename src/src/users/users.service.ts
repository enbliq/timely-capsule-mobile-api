import { Injectable, NotFoundException } from "@nestjs/common"
import type { Model } from "mongoose"
import * as bcrypt from "bcrypt"
import type { User, UserDocument } from "./schemas/user.schema"
import type { CreateUserDto } from "./dto/create-user.dto"
import type { UpdateUserDto } from "./dto/update-user.dto"

@Injectable()
export class UsersService {
  constructor(private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel({
      ...createUserDto,
      passwordHash: createUserDto.password ? await this.hashPassword(createUserDto.password) : null,
      lastLoginAt: new Date(),
    })
    return createdUser.save()
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec()
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec()
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec()
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updateData: any = { ...updateUserDto }

    // If password is provided, hash it
    if (updateUserDto.password) {
      updateData.passwordHash = await this.hashPassword(updateUserDto.password)
      delete updateData.password
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec()

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }

    return updatedUser
  }

  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec()
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
    return deletedUser
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(id, {
        lastLoginAt: new Date(),
      })
      .exec()
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt()
    return bcrypt.hash(password, salt)
  }
}
