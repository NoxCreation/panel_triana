// lib/minio.ts
import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
    endpoint: process.env.MINIO_URL, // tu endpoint MinIO
    region: "us-east-1",               // cualquier región
    credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || "admin",
        secretAccessKey: process.env.MINIO_SECRET_KEY || "admin123",
    },
    forcePathStyle: true, // necesario para MinIO
});