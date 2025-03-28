import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { WebhooksController } from "./webhooks.controller"
import { WebhooksService } from "./webhooks.service"
import { WebhookSubscription } from "./entities/webhook-subscription.entity"
import { WebhookEvent } from "./entities/webhook-event.entity"
import { WebhookDelivery } from "./entities/webhook-delivery.entity"
import { WebhooksAdminController } from "./webhooks-admin.controller"
import { WebhooksEventEmitter } from "./webhooks-event-emitter.service"
import { ThrottlerModule } from "@nestjs/throttler"

@Module({
  imports: [
    TypeOrmModule.forFeature([WebhookSubscription, WebhookEvent, WebhookDelivery]),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
  ],
  controllers: [WebhooksController, WebhooksAdminController],
  providers: [WebhooksService, WebhooksEventEmitter],
  exports: [WebhooksEventEmitter],
})
export class WebhooksModule {}

