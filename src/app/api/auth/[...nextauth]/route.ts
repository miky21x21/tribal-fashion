import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Extend the session type to include custom properties
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    provider?: string;
  }
}

// Extend the JWT type to include custom properties
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    provider?: string;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken as string;
      session.provider = token.provider as string;
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        // Handle Google sign-in
        const googleProfile = profile as any;
        user.name = googleProfile.name;
        user.email = googleProfile.email;
        user.image = googleProfile.picture;
      }
      return true;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };
