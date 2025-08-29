import NextAuth, { AuthOptions } from 'next-auth'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile: GoogleProfile) {
        return {
          // This object is passed to the `signIn` and `jwt` callbacks.
          // It must have an `id` and `email`.
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
      async authorize(credentials) {
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
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) {
          console.error("Google sign-in failed: email is missing from the profile.");
          return false;
        }

        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
          })

          if (existingUser) { // Link account if user exists but without Google ID
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
          } else { // Create new user
            const googleProfile = profile as GoogleProfile;
            await prisma.user.create({
              data: {
                email: user.email,
                firstName: googleProfile.given_name || user.name?.split(' ')[0] || '',
                lastName: googleProfile.family_name || user.name?.split(' ').slice(1).join(' ') || '',
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
    async jwt({ token, user, account }) {
      if (account && user) {
        // On initial sign-in, populate the token with user data from the database.
        let dbUser = null;

        try {
          if (user.email) {
            // Works for Google and email/password credentials
            dbUser = await prisma.user.findUnique({ where: { email: user.email } });
          } else if (user.id) {
            // Fallback for phone authentication where email is null
            dbUser = await prisma.user.findUnique({ where: { id: user.id } });
          }
        } catch (error) {
          console.error("Error fetching user in JWT callback:", error);
          // Do not proceed if user cannot be fetched
          return token;
        }

        if (dbUser) { // Ensure dbUser is not null before proceeding
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
          token.image = dbUser.image || dbUser.avatar
        }
      }

      if (token.sub) {
        // On subsequent requests, this block can refresh the token if user data changes.
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
    async session({ session, token }) {
      if (token && session.user) {
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