import NextAuth from 'next-auth/next'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import type { Session } from "next-auth"
import type { JWT } from "next-auth/jwt"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile: any) {
        return {
          id: profile.sub,
          name: profile.name,
          firstName: profile.given_name || '',
          lastName: profile.family_name || '',
          email: profile.email,
          image: profile.picture,
          role: 'CUSTOMER',
          authProvider: 'GOOGLE',
          googleId: profile.sub,
        }
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        phoneNumber: { label: "Phone Number", type: "tel" },
        authProvider: { label: "Auth Provider", type: "text" },
      },
      async authorize(credentials: any) {
        if (!credentials) return null

        try {
          if (credentials.authProvider === 'PHONE' && credentials.phoneNumber) {
            const user = await prisma.user.findUnique({
              where: { phoneNumber: credentials.phoneNumber }
            })
            
            if (user && user.isPhoneVerified) {
              return {
                id: user.id,
                email: user.email,
                name: user.name || `${user.firstName} ${user.lastName}`,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image || user.avatar,
                role: user.role,
                authProvider: user.authProvider,
                phoneNumber: user.phoneNumber,
                isPhoneVerified: user.isPhoneVerified,
              }
            }
          } else if (credentials.email && credentials.password) {
            const user = await prisma.user.findUnique({
              where: { email: credentials.email }
            })

            if (user && user.password && await bcrypt.compare(credentials.password, user.password)) {
              return {
                id: user.id,
                email: user.email,
                name: user.name || `${user.firstName} ${user.lastName}`,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image || user.avatar,
                role: user.role,
                authProvider: user.authProvider,
                phoneNumber: user.phoneNumber,
                isPhoneVerified: user.isPhoneVerified,
              }
            }
          }

          return null
        } catch (error) {
          console.error("Authorization error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: { user: any; account: any; profile?: any }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (existingUser) {
            if (!existingUser.googleId) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                  googleId: account.providerAccountId,
                  authProvider: 'GOOGLE',
                  image: user.image,
                  name: user.name,
                  emailVerified: new Date(),
                }
              })
            }
          } else {
            await prisma.user.create({
              data: {
                email: user.email!,
                firstName: (profile as { given_name?: string })?.given_name || user.name?.split(' ')[0] || '',
                lastName: (profile as { family_name?: string })?.family_name || user.name?.split(' ').slice(1).join(' ') || '',
                name: user.name || '',
                image: user.image,
                googleId: account.providerAccountId,
                authProvider: 'GOOGLE',
                emailVerified: new Date(),
              }
            })
          }
        } catch (error) {
          console.error("SignIn callback error:", error)
          return false
        }
      }

      return true
    },
    async jwt({ token, user, account }: { token: any; user: any; account: any }) {
      if (account && user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })

        if (dbUser) {
          token.sub = dbUser.id
          token.email = dbUser.email
          token.firstName = dbUser.firstName
          token.lastName = dbUser.lastName
          token.role = dbUser.role
          token.authProvider = dbUser.authProvider
          token.phoneNumber = dbUser.phoneNumber
          token.isPhoneVerified = dbUser.isPhoneVerified
          token.googleId = dbUser.googleId
          token.appleId = dbUser.appleId
        }
      }

      if (token.sub) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.sub }
          })

          if (dbUser) {
            token.email = dbUser.email
            token.firstName = dbUser.firstName
            token.lastName = dbUser.lastName
            token.role = dbUser.role
            token.authProvider = dbUser.authProvider
            token.phoneNumber = dbUser.phoneNumber
            token.isPhoneVerified = dbUser.isPhoneVerified
            token.googleId = dbUser.googleId
            token.appleId = dbUser.appleId
            token.image = dbUser.image || dbUser.avatar
          }
        } catch (error) {
          console.error("JWT callback error:", error)
        }
      }

      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.sub!
        session.user.email = token.email as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.role = token.role as string
        session.user.authProvider = token.authProvider as string
        session.user.phoneNumber = token.phoneNumber as string | null
        session.user.isPhoneVerified = token.isPhoneVerified as boolean
        session.user.googleId = token.googleId as string | null
        session.user.appleId = token.appleId as string | null
        session.user.image = token.image as string | undefined
      }

      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }