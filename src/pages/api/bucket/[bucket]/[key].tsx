// pages/api/imagen.ts
import { NextApiRequest, NextApiResponse } from "next";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/utils/minio";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { bucket, key } = req.query;
        if (!bucket || !key) return res.status(400).json({ error: "Faltan parámetros" });

        const command = new GetObjectCommand({ Bucket: bucket as string, Key: key as string });
        // URL válida por 5 minutos (ajusta según necesites)
        const presignedUrl = await getSignedUrl(s3 as any, command, { expiresIn: 60 * 5 });

        // Redirigir (302 para que el navegador no cachee la redirección)
        res.redirect(302, presignedUrl);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error interno" });
    }
}