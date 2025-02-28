import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { Message, MessageStatus } from "../entities/message.entity"
import { Attachment, type AttachmentType } from "../entities/attachment.entity"
import type { SendMessageDto } from "../dto/send-message.dto"
import type { UpdateMessageStatusDto } from "../dto/update-message-status.dto"

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Attachment)
    private attachmentRepository: Repository<Attachment>,
  ) {}

  async sendMessage(sendMessageDto: SendMessageDto): Promise<Message> {
    if (!sendMessageDto.receiverId && !sendMessageDto.groupId) {
      throw new BadRequestException("Either receiverId or groupId must be provided")
    }

    const message = this.messageRepository.create({
      content: sendMessageDto.content,
      senderId: sendMessageDto.senderId,
      receiverId: sendMessageDto.receiverId,
      groupId: sendMessageDto.groupId,
      status: MessageStatus.SENT,
    })

    const savedMessage = await this.messageRepository.save(message)

    if (sendMessageDto.attachments && sendMessageDto.attachments.length > 0) {
      const attachments = sendMessageDto.attachments.map((attachment) => {
        return this.attachmentRepository.create({
          url: attachment.url,
          filename: attachment.filename,
          type: attachment.type as AttachmentType,
          size: attachment.size,
          messageId: savedMessage.id,
        })
      })

      await this.attachmentRepository.save(attachments)
      savedMessage.attachments = attachments
    }

    return savedMessage
  }

  async getMessageHistory(
    userId: number,
    receiverId?: number,
    groupId?: string,
    pagination = { page: 1, limit: 20 },
  ): Promise<{ messages: Message[]; total: number; page: number; limit: number }> {
    if (!receiverId && !groupId) {
      throw new BadRequestException("Either receiverId or groupId must be provided")
    }

    const skip = (pagination.page - 1) * pagination.limit

    let query = this.messageRepository
      .createQueryBuilder("message")
      .leftJoinAndSelect("message.attachments", "attachment")
      .orderBy("message.createdAt", "DESC")
      .take(pagination.limit)
      .skip(skip)

    if (groupId) {
      query = query.where("message.groupId = :groupId", { groupId })
    } else {
      query = query.where(
        "(message.senderId = :userId AND message.receiverId = :receiverId) OR " +
          "(message.senderId = :receiverId AND message.receiverId = :userId)",
        { userId, receiverId },
      )
    }

    const [messages, total] = await query.getManyAndCount()

    return {
      messages: messages.reverse(),
      total,
      page: pagination.page,
      limit: pagination.limit,
    }
  }

  async updateMessageStatus(updateStatusDto: UpdateMessageStatusDto): Promise<Message> {
    const { messageId, status } = updateStatusDto

    const message = await this.messageRepository.findOne({ where: { id: messageId } })

    if (!message) {
      throw new NotFoundException(`Message with ID ${messageId} not found`)
    }

    message.status = status
    return this.messageRepository.save(message)
  }

  async getUnreadMessages(userId: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: {
        receiverId: userId,
        status: MessageStatus.SENT,
      },
      relations: ["attachments"],
      order: {
        createdAt: "ASC",
      },
    })
  }
}

