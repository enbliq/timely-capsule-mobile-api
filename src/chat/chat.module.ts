import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ChatController } from "./controllers/chat.controller"
import { GroupController } from "./controllers/group.controller"
import { Message } from "./entities/message.entity"
import { ChatGroup } from "./entities/chat-group.entity"
import { ChatService } from "./services/chat.service"
import { GroupService } from "./services/group.service"
import { ChatGateway } from "./gateways/chat.gateway"
import { Attachment } from "./entities/attachment.entity"
import { GroupMember } from "./entities/group-member.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Message, ChatGroup, Attachment, GroupMember])],
  controllers: [ChatController, GroupController],
  providers: [ChatService, GroupService, ChatGateway],
  exports: [ChatService, GroupService],
})
export class ChatModule {}

