import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

export async function checkPassword(password: string, hashedPassword: string) {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    console.error('Error verifying password:', error);
    throw error;
  }
}

export async function generateHash(password: string) {
  try {
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
}

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET as string) as JwtPayload;
  } catch (error) {
    throw new Error(`Token inválido o expirado ${error}`);
  }
};
