import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"
import { WebhookSubscription } from "./entities/webhook-subscription.entity"
import { WebhookEvent } from "./entities/webhook-event.entity"
import { WebhookDelivery } from "./entities/webhook-delivery.entity"
import type { CreateSubscriptionDto } from "./dto/create-subscription.dto"
import type { UpdateSubscriptionDto } from "./dto/update-subscription.dto"
import * as crypto from "crypto"
import axios from "axios"

@Injectable()
export class WebhooksService {
  constructor(
    @InjectRepository(WebhookSubscription)
    private subscriptionRepository: Repository<WebhookSubscription>,
    @InjectRepository(WebhookEvent)
    private eventRepository: Repository<WebhookEvent>,
    @InjectRepository(WebhookDelivery)
    private deliveryRepository: Repository<WebhookDelivery>,
  ) {}

  async createSubscription(createDto: CreateSubscriptionDto): Promise<WebhookSubscription> {
    const subscription = this.subscriptionRepository.create(createDto)
    return this.subscriptionRepository.save(subscription)
  }

  async findAllSubscriptions(): Promise<WebhookSubscription[]> {
    return this.subscriptionRepository.find()
  }

  async findSubscriptionById(id: string): Promise<WebhookSubscription> {
    const subscription = await this.subscriptionRepository.findOne({ where: { id } })
    if (!subscription) {
      throw new NotFoundException(`Webhook subscription with ID ${id} not found`)
    }
    return subscription
  }

  async updateSubscription(id: string, updateDto: UpdateSubscriptionDto): Promise<WebhookSubscription> {
    const subscription = await this.findSubscriptionById(id)
    Object.assign(subscription, updateDto)
    return this.subscriptionRepository.save(subscription)
  }

  async deleteSubscription(id: string): Promise<void> {
    const result = await this.subscriptionRepository.delete(id)
    if (result.affected === 0) {
      throw new NotFoundException(`Webhook subscription with ID ${id} not found`)
    }
  }

  async recordEvent(name: string, payload: Record<string, any>): Promise<WebhookEvent> {
    const event = this.eventRepository.create({
      name,
      payload,
    })
    return this.eventRepository.save(event)
  }

  async findSubscriptionsForEvent(eventName: string): Promise<WebhookSubscription[]> {
    return this.subscriptionRepository.find({
      where: {
        active: true,
        events: eventName, // This is simplified - in a real implementation you'd need a more complex query
      },
    })
  }

  async deliverWebhook(
    subscription: WebhookSubscription,
    eventName: string,
    payload: Record<string, any>,
  ): Promise<WebhookDelivery> {
    const delivery = this.deliveryRepository.create({
      subscription,
      eventName,
      payload,
    })

    try {
      const signature = this.generateSignature(subscription.secret, payload)
      const response = await axios.post(subscription.url, payload, {
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Signature": signature,
          "X-Webhook-Event": eventName,
        },
        timeout: 10000, // 10 seconds timeout
      })

      delivery.responseStatus = response.status
      delivery.responseBody = JSON.stringify(response.data)
      delivery.success = response.status >= 200 && response.status < 300
    } catch (error) {
      delivery.success = false
      delivery.error = error.message
    }

    return this.deliveryRepository.save(delivery)
  }

  generateSignature(secret: string, payload: Record<string, any>): string {
    const hmac = crypto.createHmac("sha256", secret)
    hmac.update(JSON.stringify(payload))
    return hmac.digest("hex")
  }

  async verifySignature(payload: string, signature: string, secret: string): Promise<boolean> {
    const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex")

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  }

  async getDeliveriesForSubscription(subscriptionId: string): Promise<WebhookDelivery[]> {
    const subscription = await this.findSubscriptionById(subscriptionId)
    return this.deliveryRepository.find({
      where: { subscription: { id: subscription.id } },
      order: { createdAt: "DESC" },
      take: 100,
    })
  }

  async retryDelivery(deliveryId: string): Promise<WebhookDelivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id: deliveryId },
      relations: ["subscription"],
    })

    if (!delivery) {
      throw new NotFoundException(`Webhook delivery with ID ${deliveryId} not found`)
    }

    return this.deliverWebhook(delivery.subscription, delivery.eventName, delivery.payload)
  }
}

