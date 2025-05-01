export class PresignedUrlResponseDto {
  uploadUrl: string
  storageUrl: string
  fields?: Record<string, string>
  expiresIn: number
}
