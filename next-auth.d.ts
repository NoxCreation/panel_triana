import { DefaultSession, DefaultUser } from 'next-auth'
import { DefaultJWT, JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string,
      image: string,
      username: string,
      first_name: string,
      last_name: string,
      tokenAccess: string,
      iat: number,
      exp: number,
      jti: string
    } & DefaultSession
  }

  interface User extends DefaultUser {
    user: {
      id: string,
      image: string,
      username: string,
      first_name: string,
      last_name: string,
      tokenAccess: string,
      iat: number,
      exp: number,
      jti: string
    } & DefaultSession
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    user: {
      id: string,
      image: string,
      username: string,
      first_name: string,
      last_name: string,
      tokenAccess: string,
      iat: number,
      exp: number,
      jti: string
    } & DefaultSession
  }
}
