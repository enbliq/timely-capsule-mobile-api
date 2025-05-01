import { SetMetadata } from "@nestjs/common"

export const GUEST_ALLOWED_KEY = "guestAllowed"
export const GuestAllowed = () => SetMetadata(GUEST_ALLOWED_KEY, true)
