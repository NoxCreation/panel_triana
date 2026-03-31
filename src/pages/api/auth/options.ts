import { checkPassword } from '@/utils/generateHash'
import { prisma } from '@/utils/prisma'
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default async function authNext(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          password: { label: 'password', type: 'password', placeholder: 'password' },
          email: { label: 'email', type: 'text', placeholder: 'email' }
        },
        async authorize(credentials: any) {
          const { email, password } = credentials

          const user_system = await prisma.user.findUnique({
            where: {
              email
            }
          })

          if (!user_system) {
            throw new Error("Usuario no existe")
          }
          
          const valid = await checkPassword(password, user_system.password_hash);
          console.log("A", valid)
          if (!valid) {
            throw new Error("Contraseña no valida")
          }

          const user = {
            ...user_system,
            photo: ""
          } as any

          // Generar el token JWT
          const secretKey = process.env.NEXTAUTH_SECRET as string;
          const accessToken = jwt.sign(user, secretKey, { expiresIn: '1d' });

          if (!accessToken) {
            return false
          }
          user.accessToken = accessToken;

          console.log("user", user)

          return { ...user }
        },
      }),
    ],
    pages: {
      signIn: '/home',
      signOut: '/auth',
    },
    callbacks: {
      async jwt(props) {
        const { token, user } = props
        if (user) {
          token.accessToken = (user as any).accessToken;
        }
        return { ...user, ...token }
      },

      async session(props) {
        const { session, token } = props
        session.user = token as any
        //console.log("token", token) 
        return session
      },
      async redirect({ url, baseUrl }) {
        if (url.startsWith('/')) return `${baseUrl}${url}`
        else if (new URL(url).origin === baseUrl) return url
        return baseUrl
      },
    },
    session: {
      strategy: 'jwt',
      maxAge: 24 * 60 * 60 // 1 day //7 * 24 * 60 * 60, // 7 days
    },
    jwt: {
      maxAge: 24 * 60 * 60 // 1 day //7 * 24 * 60 * 60, // 7 days
    },
  })
}
