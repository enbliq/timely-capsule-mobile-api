import { InjectModel } from "@nestjs/mongoose"
import type { Model } from "mongoose"
import { AuditLog, type AuditLogDocument } from "./schemas/audit-log.schema"

export interface CreateAuditLogDto {
  action: string
  resource: string
  details?: unknown
  userId?: string
  userEmail?: string
  ipAddress?: string
  userAgent?: string
}

export class AuditService {
  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
  ) {}

  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const createdAuditLog = new this.auditLogModel(createAuditLogDto)
    return createdAuditLog.save()
  }

  async findAll(): Promise<AuditLog[]> {
    return this.auditLogModel.find().sort({ createdAt: -1 }).exec()
  }

  async findByUser(userId: string): Promise<AuditLog[]> {
    return this.auditLogModel.find({ userId }).sort({ createdAt: -1 }).exec()
  }

  async findByResource(resource: string): Promise<AuditLog[]> {
    return this.auditLogModel.find({ resource }).sort({ createdAt: -1 }).exec()
  }

  async findByAction(action: string): Promise<AuditLog[]> {
    return this.auditLogModel.find({ action }).sort({ createdAt: -1 }).exec()
  }
}
