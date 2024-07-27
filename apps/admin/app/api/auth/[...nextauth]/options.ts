import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import db from '@repo/db/client';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          const admin = await db.admin.findFirst({
            where: {
              email: credentials.identifier
            },
          });

          if (!admin) {
            throw new Error('No admin found with this email');
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            admin.password
          );

          if (isPasswordCorrect && admin.isverified) {
            return admin;
          } else {
            throw new Error('Incorrect password or email not verified');
          }
        } catch (err: any) {
          throw new Error(err.message || 'Internal Server Error');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id?.toString();
        token.isVerified = user.isVerified;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          isVerified: token.isVerified,
          email: token.email,
        };
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
};
