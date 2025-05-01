import { Injectable, BadRequestException } from "@nestjs/common"
import type { ConfigService } from "@nestjs/config"
import * as AWS from "aws-sdk"
import * as cloudinary from "cloudinary"
import { v4 as uuidv4 } from "uuid"

@Injectable()
export class StorageService {
  private s3: AWS.S3
  private cloudinary: typeof cloudinary.v2
  private readonly provider: string
  private readonly bucket: string
  private readonly region: string
  private readonly uploadExpirySeconds: number

  constructor(private configService: ConfigService) {
    this.provider = this.configService.get<string>("storage.provider")
    this.bucket = this.configService.get<string>("storage.bucket")
    this.region = this.configService.get<string>("storage.region")
    this.uploadExpirySeconds = this.configService.get<number>("storage.uploadExpirySeconds")

    if (this.provider === "s3") {
      this.s3 = new AWS.S3({
        region: this.region,
        accessKeyId: this.configService.get<string>("storage.accessKeyId"),
        secretAccessKey: this.configService.get<string>("storage.secretAccessKey"),
      })
    } else if (this.provider === "cloudinary") {
      this.cloudinary = cloudinary.v2
      this.cloudinary.config({
        cloud_name: this.configService.get<string>("storage.cloudinaryCloudName"),
        api_key: this.configService.get<string>("storage.cloudinaryApiKey"),
        api_secret: this.configService.get<string>("storage.cloudinaryApiSecret"),
      })
    }
  }

  async getPresignedUploadUrl(
    fileName: string,
    fileType: string,
    isEncrypted: boolean,
  ): Promise<{ uploadUrl: string; storageUrl: string; fields?: Record<string, string>; expiresIn: number }> {
    if (this.provider === "s3") {
      return this.getS3PresignedUrl(fileName, fileType, isEncrypted)
    } else if (this.provider === "cloudinary") {
      return this.getCloudinaryPresignedUrl(fileName, fileType, isEncrypted)
    } else {
      throw new BadRequestException(`Unsupported storage provider: ${this.provider}`)
    }
  }

  private async getS3PresignedUrl(
    fileName: string,
    fileType: string,
    isEncrypted: boolean,
  ): Promise<{ uploadUrl: string; storageUrl: string; fields?: Record<string, string>; expiresIn: number }> {
    // Generate a unique key for the file
    const fileExtension = fileName.split(".").pop()
    const uniqueId = uuidv4()
    const prefix = isEncrypted ? "encrypted/" : ""
    const key = `${prefix}${uniqueId}.${fileExtension}`

    // Generate a presigned URL
    const params = {
      Bucket: this.bucket,
      Key: key,
      ContentType: fileType,
      Expires: this.uploadExpirySeconds,
    }

    const uploadUrl = this.s3.getSignedUrl("putObject", params)
    const storageUrl = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`

    return {
      uploadUrl,
      storageUrl,
      expiresIn: this.uploadExpirySeconds,
    }
  }

  private async getCloudinaryPresignedUrl(
    fileName: string,
    fileType: string,
    isEncrypted: boolean,
  ): Promise<{ uploadUrl: string; storageUrl: string; fields: Record<string, string>; expiresIn: number }> {
    // Generate a unique public_id for the file
    const fileExtension = fileName.split(".").pop()
    const uniqueId = uuidv4()
    const prefix = isEncrypted ? "encrypted/" : ""
    const publicId = `${prefix}${uniqueId}`

    // Generate a timestamp and signature
    const timestamp = Math.round(new Date().getTime() / 1000)
    const folder = "timely-capsule"

    // Create the signature
    const params = {
      timestamp,
      public_id: publicId,
      folder,
    }

    const signature = this.cloudinary.utils.api_sign_request(
      params,
      this.configService.get<string>("storage.cloudinaryApiSecret"),
    )

    // Construct the upload URL and fields
    const uploadUrl = `https://api.cloudinary.com/v1_1/${this.configService.get<string>(
      "storage.cloudinaryCloudName",
    )}/auto/upload`

    const fields = {
      api_key: this.configService.get<string>("storage.cloudinaryApiKey"),
      timestamp: timestamp.toString(),
      signature,
      public_id: publicId,
      folder,
    }

    // Construct the storage URL
    const storageUrl = `https://res.cloudinary.com/${this.configService.get<string>(
      "storage.cloudinaryCloudName",
    )}/image/upload/${publicId}.${fileExtension}`

    return {
      uploadUrl,
      storageUrl,
      fields,
      expiresIn: this.uploadExpirySeconds,
    }
  }

  async deleteFile(storageUrl: string): Promise<boolean> {
    try {
      if (this.provider === "s3") {
        // Extract the key from the storage URL
        const key = storageUrl.split(`https://${this.bucket}.s3.${this.region}.amazonaws.com/`)[1]

        await this.s3
          .deleteObject({
            Bucket: this.bucket,
            Key: key,
          })
          .promise()
      } else if (this.provider === "cloudinary") {
        // Extract the public_id from the storage URL
        const publicId = storageUrl.split("/upload/")[1].split(".")[0]

        await this.cloudinary.uploader.destroy(publicId)
      }

      return true
    } catch (error) {
      console.error("Error deleting file:", error)
      return false
    }
  }
}
