import { registerAs } from "@nestjs/config"

export default registerAs("storage", () => ({
  provider: process.env.STORAGE_PROVIDER || "s3",
  region: process.env.AWS_REGION || "us-east-1",
  bucket: process.env.AWS_S3_BUCKET || "timely-capsule",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  uploadExpirySeconds: Number.parseInt(process.env.UPLOAD_EXPIRY_SECONDS || "3600", 10),
}))
