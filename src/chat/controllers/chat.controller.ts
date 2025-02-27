import { Controller, Get, Post, Body, Query } from "@nestjs/common"
import type { ChatService } from "../services/chat.service"
import type { SendMessageDto } from "../dto/send-message.dto"
import type { UpdateMessageStatusDto } from "../dto/update-message-status.dto"

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  async sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.chatService.sendMessage(sendMessageDto);
  }

  @Get("history")
  async getMessageHistory(
    @Query('userId') userId: number,
    @Query('receiverId') receiverId?: number,
    @Query('groupId') groupId?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.chatService.getMessageHistory(userId, receiverId, groupId, { page, limit })
  }

  @Post('status')
  async updateMessageStatus(@Body() updateStatusDto: UpdateMessageStatusDto) {
    return this.chatService.updateMessageStatus(updateStatusDto);
  }

  @Get('unread')
  async getUnreadMessages(@Query('userId') userId: number) {
    return this.chatService.getUnreadMessages(userId);
  }
}

