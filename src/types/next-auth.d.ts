declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      firstName: string
      lastName: string
      name?: string
      image?: string
      role: string
      authProvider: string
      phoneNumber?: string | null
      isPhoneVerified: boolean
      googleId?: string | null
      appleId?: string | null
    }
  }

  interface User {
    id: string
    email?: string
    firstName: string
    lastName: string
    name?: string
    image?: string
    role: string
    authProvider: string
    phoneNumber?: string | null
    isPhoneVerified: boolean
    googleId?: string | null
    appleId?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string
    email: string
    firstName: string
    lastName: string
    role: string
    authProvider: string
    phoneNumber?: string | null
    isPhoneVerified: boolean
    googleId?: string | null
    appleId?: string | null
    image?: string | null
  }
}