import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Extend the session type to include custom properties
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
      authProvider: string;
      firstName: string;
      lastName: string;
    };
  }
}

// Extend the JWT type to include custom properties
declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    role: string;
    authProvider: string;
    firstName: string;
    lastName: string;
  }
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Create Prisma client
          const prisma = new PrismaClient();
          
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.toLowerCase() },
            include: { profile: true }
          });

          if (!user) {
            return null;
          }

          // Check if user has a password (OAuth users might not have one)
          if (!user.password) {
            return null;
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            return null;
          }

          // Return user data for NextAuth
          return {
            id: user.id,
            email: user.email,
            name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            firstName: user.firstName || user.profile?.firstName || '',
            lastName: user.lastName || user.profile?.lastName || '',
            role: user.role || 'user',
            authProvider: user.authProvider || 'email'
          };
        } catch (error) {
          console.error("Credentials auth error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id;
        token.role = (user as any).role || 'user';
        token.authProvider = (user as any).authProvider || 'email';
        token.firstName = (user as any).firstName || '';
        token.lastName = (user as any).lastName || '';
      }
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId;
        session.user.role = token.role;
        session.user.authProvider = token.authProvider;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
