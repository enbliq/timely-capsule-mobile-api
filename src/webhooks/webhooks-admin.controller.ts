import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from "@nestjs/common"
import type { WebhooksService } from "./webhooks.service"
import type { CreateSubscriptionDto } from "./dto/create-subscription.dto"
import type { UpdateSubscriptionDto } from "./dto/update-subscription.dto"
import type { WebhookSubscription } from "./entities/webhook-subscription.entity"
import type { WebhookDelivery } from "./entities/webhook-delivery.entity"
import { AuthGuard } from "@nestjs/passport"

@Controller("admin/webhooks")
@UseGuards(AuthGuard("jwt")) // Assuming you have JWT authentication set up
export class WebhooksAdminController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Get("subscriptions")
  async getAllSubscriptions(): Promise<WebhookSubscription[]> {
    return this.webhooksService.findAllSubscriptions()
  }

  @Get('subscriptions/:id')
  async getSubscriptionById(@Param('id') id: string): Promise<WebhookSubscription> {
    return this.webhooksService.findSubscriptionById(id);
  }

  @Post('subscriptions')
  async createSubscription(
    @Body() createDto: CreateSubscriptionDto,
  ): Promise<WebhookSubscription> {
    return this.webhooksService.createSubscription(createDto);
  }

  @Put("subscriptions/:id")
  async updateSubscription(
    @Param('id') id: string,
    @Body() updateDto: UpdateSubscriptionDto,
  ): Promise<WebhookSubscription> {
    return this.webhooksService.updateSubscription(id, updateDto)
  }

  @Delete('subscriptions/:id')
  async deleteSubscription(@Param('id') id: string): Promise<{ success: boolean }> {
    await this.webhooksService.deleteSubscription(id);
    return { success: true };
  }

  @Get('subscriptions/:id/deliveries')
  async getDeliveriesForSubscription(
    @Param('id') id: string,
  ): Promise<WebhookDelivery[]> {
    return this.webhooksService.getDeliveriesForSubscription(id);
  }

  @Post('deliveries/:id/retry')
  async retryDelivery(@Param('id') id: string): Promise<WebhookDelivery> {
    return this.webhooksService.retryDelivery(id);
  }
}

