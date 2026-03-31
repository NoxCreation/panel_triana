import { NextApiRequest, NextApiResponse } from "next";
import { generateHash } from "@/utils/generateHash";
import { prisma } from "@/utils/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {
    await prisma.user.create({
      data: {
        first_name: "Juan",
        last_name: "Ernesto",
        email: 'juan@gmail.com',
        role: 'ADMIN',
        password_hash: await generateHash("Holamundo123*")
      }
    })

    return res.status(200).json({ message: "usuario creado" });
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}