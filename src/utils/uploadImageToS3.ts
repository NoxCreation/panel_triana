import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./minio";

const BUCKET = process.env.BUCKET_MEDIA || "media";

// Función auxiliar para subir imagen en base64 a S3 y retornar la URL pública
export async function uploadImageToS3(base64: string): Promise<string> {
    // Generar nombre aleatorio único
    const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join("");
    const imageFileName = `${randomName}.jpg`;
    const imageUrl = `/api/bucket/${BUCKET}/${imageFileName}`;

    // Validar y preparar el buffer
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Subir a S3
    await s3.send(
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: imageFileName,
            Body: imageBuffer,
            ContentType: "image/jpeg",
        })
    );

    return imageUrl;
}