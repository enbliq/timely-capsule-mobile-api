import { Controller, Post, Body, Headers, UnauthorizedException, BadRequestException } from "@nestjs/common"
import type { WebhooksService } from "./webhooks.service"
import { Throttle } from "@nestjs/throttler"

@Controller("webhooks")
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post("receive/:id")
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async receiveWebhook(
    @Body() payload: any,
    @Headers('x-webhook-signature') signature: string,
    @Headers('x-api-key') apiKey: string,
  ) {
    // In a real application, you would validate the API key against your database
    if (!apiKey || apiKey !== process.env.WEBHOOK_API_KEY) {
      throw new UnauthorizedException("Invalid API key")
    }

    if (!signature) {
      throw new BadRequestException("Missing webhook signature")
    }

    // In a real application, you would look up the webhook secret based on the API key or other identifier
    const webhookSecret = process.env.WEBHOOK_SECRET

    const isValid = await this.webhooksService.verifySignature(JSON.stringify(payload), signature, webhookSecret)

    if (!isValid) {
      throw new UnauthorizedException("Invalid webhook signature")
    }

    // Process the webhook payload
    // This would depend on your application's needs
    return { received: true }
  }
}

