import { Injectable } from "@nestjs/common"
import type { WebhooksService } from "./webhooks.service"

@Injectable()
export class WebhooksEventEmitter {
  constructor(private webhooksService: WebhooksService) {}

  async emit(eventName: string, payload: Record<string, any>): Promise<void> {
    // Record the event
    await this.webhooksService.recordEvent(eventName, payload)

    // Find all active subscriptions for this event
    const subscriptions = await this.webhooksService.findSubscriptionsForEvent(eventName)

    // Deliver the webhook to each subscription
    for (const subscription of subscriptions) {
      this.webhooksService.deliverWebhook(subscription, eventName, payload).catch((error) => {
        console.error(`Failed to deliver webhook to ${subscription.url}:`, error)
      })
    }
  }
}

