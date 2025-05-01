import { Injectable } from "@nestjs/common"

export interface EncryptionMetadata {
  algorithm: "AES-256-GCM"
  encrypted: boolean
  iv: string
}

@Injectable()
export class EncryptionService {
  /**
   * Validates encryption metadata
   * The actual encryption/decryption happens client-side
   * This service only validates and manages metadata
   */
  validateEncryptionMetadata(metadata: EncryptionMetadata): boolean {
    if (!metadata) {
      return false
    }

    // Check if all required fields are present
    if (!metadata.algorithm || !metadata.iv) {
      return false
    }

    // Check if algorithm is supported
    if (metadata.algorithm !== "AES-256-GCM") {
      return false
    }

    // Check if IV is in the correct format (base64 string)
    try {
      const ivBuffer = Buffer.from(metadata.iv, "base64")
      // AES-GCM typically uses a 12-byte (96-bit) IV
      if (ivBuffer.length !== 12) {
        return false
      }
    } catch (error) {
      return false
    }

    return true
  }

  /**
   * Generates a random IV for AES-GCM encryption
   * This is provided as a helper for testing
   * In production, the client should generate this
   */
  generateIV(): string {
    // Generate a random 12-byte buffer
    const iv = Buffer.from(
      Array(12)
        .fill(0)
        .map(() => Math.floor(Math.random() * 256)),
    )
    // Return as base64 string
    return iv.toString("base64")
  }

  /**
   * Checks if a string is likely encrypted
   * This is a simple heuristic and not foolproof
   */
  isLikelyEncrypted(content: string): boolean {
    // Check if the content starts with a common encryption prefix
    if (content.startsWith("encrypted:")) {
      return true
    }

    // Check if the content is base64-encoded
    const base64Regex = /^[A-Za-z0-9+/=]+$/
    if (base64Regex.test(content) && content.length % 4 === 0) {
      return true
    }

    return false
  }
}
