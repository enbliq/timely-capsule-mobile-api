import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  type OnGatewayConnection,
  type OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets"
import type { Server, Socket } from "socket.io"
import type { ChatService } from "../services/chat.service"
import type { SendMessageDto } from "../dto/send-message.dto"
import type { UpdateMessageStatusDto } from "../dto/update-message-status.dto"

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private userSockets: Map<number, string> = new Map()

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`)
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`)

    // Remove user from userSockets map
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId)
        break
      }
    }
  }

  @SubscribeMessage("register")
  handleRegister(@ConnectedSocket() client: Socket, @MessageBody() userId: number): void {
    this.userSockets.set(userId, client.id)
    console.log(`User ${userId} registered with socket ${client.id}`)

    // Join user to their personal room
    client.join(`user-${userId}`)
  }

  @SubscribeMessage("joinGroup")
  handleJoinGroup(@ConnectedSocket() client: Socket, @MessageBody() groupId: string): void {
    client.join(`group-${groupId}`)
    console.log(`Socket ${client.id} joined group ${groupId}`)
  }

  @SubscribeMessage("leaveGroup")
  handleLeaveGroup(@ConnectedSocket() client: Socket, @MessageBody() groupId: string): void {
    client.leave(`group-${groupId}`)
    console.log(`Socket ${client.id} left group ${groupId}`)
  }

  @SubscribeMessage("sendMessage")
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() sendMessageDto: SendMessageDto,
  ): Promise<void> {
    try {
      const message = await this.chatService.sendMessage(sendMessageDto)

      if (message.groupId) {
        // Group message
        this.server.to(`group-${message.groupId}`).emit("newMessage", message)
      } else {
        // Direct message
        // Emit to sender
        this.server.to(`user-${message.senderId}`).emit("newMessage", message)

        // Emit to receiver
        this.server.to(`user-${message.receiverId}`).emit("newMessage", message)
      }
    } catch (error) {
      client.emit("error", { message: error.message })
    }
  }

  @SubscribeMessage("updateMessageStatus")
  async handleUpdateMessageStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody() updateStatusDto: UpdateMessageStatusDto,
  ): Promise<void> {
    try {
      const message = await this.chatService.updateMessageStatus(updateStatusDto)

      // Notify the sender about the status update
      this.server.to(`user-${message.senderId}`).emit("messageStatusUpdated", {
        messageId: message.id,
        status: message.status,
      })
    } catch (error) {
      client.emit("error", { message: error.message })
    }
  }

  @SubscribeMessage("typing")
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { senderId: number; receiverId?: number; groupId?: string },
  ): void {
    if (data.groupId) {
      // Group typing notification
      this.server.to(`group-${data.groupId}`).emit("userTyping", {
        userId: data.senderId,
        groupId: data.groupId,
      })
    } else if (data.receiverId) {
      // Direct message typing notification
      this.server.to(`user-${data.receiverId}`).emit("userTyping", {
        userId: data.senderId,
      })
    }
  }
}

