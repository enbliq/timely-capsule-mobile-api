export enum WebhookEventType {
  // Content events
  CONTENT_CREATED = "content.created",
  CONTENT_UPDATED = "content.updated",
  CONTENT_DELETED = "content.deleted",

  // User events
  USER_CREATED = "user.created",
  USER_UPDATED = "user.updated",
  USER_DELETED = "user.deleted",
  USER_LOGIN = "user.login",

  // Other events
  COMMENT_CREATED = "comment.created",
  ORDER_PLACED = "order.placed",
  PAYMENT_RECEIVED = "payment.received",
}

