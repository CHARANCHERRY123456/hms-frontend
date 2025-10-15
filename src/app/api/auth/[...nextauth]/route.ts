// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id?: number | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      accessToken?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: number;
    role?: string;
    email?: string;
    accessToken?: string;
  }
}

// -------------------------------
// NEXTAUTH CONFIG
// -------------------------------
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'test@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide both email and password.');
        }

        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          const { user, token } = res.data;

          if (res.status === 200 && user) {
            return {
              id: user.id ?? null,
              name: user.username ?? '',
              email: user.email,
              role: user.role ?? 'user',
              accessToken: token,
            };
          }
          return null;
        } catch (error: any) {
          console.error('Credentials login error:', error.response?.data || error.message);
          throw new Error(error.response?.data?.detail || 'Invalid email or password.');
        }
      },
    }),

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
      // 🔹 Case 1: Credentials Login
      if (user && !account?.id_token) {
        token.id = Number(user.id);
        token.role = (user as any).role;
        token.email = user.email ?? undefined;
        token.accessToken = (user as any).accessToken ?? '';
      }

      // 🔹 Case 2: Google Login
      if (account?.id_token) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google-login`,
            { token: account.id_token }
          );
          const { user } = res.data;
          token.id = user.id ?? null;
          token.role = user.role;
          token.email = user.email;
          token.accessToken = res.data?.token ?? '';
        } catch (error) {
          console.error('Error fetching user info for Google login:', error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id ? Number(token.id) : null;
      session.user.role = token.role;
      session.user.email = token.email;
      session.user.accessToken = token.accessToken ?? null;
      return session;
    },
  },

  pages: {
    signIn: '/', // redirect to homepage or your custom login page
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
