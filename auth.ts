import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './db/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';
import { cookies } from 'next/headers';

export const config: NextAuthConfig = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'Email' },
        password: { label: 'Password', type: 'password', placeholder: 'Password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findFirst({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const isMatch = compareSync(credentials.password as string, user.password as string);
        if (!isMatch) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      // Ensure session.user exists
      if (!session.user) {
        session.user = {} as any;
      }

      if (token?.sub) {
        (session.user as any).id = token.sub;
      }
      if (token?.role) {
        (session.user as any).role = token.role;
      }
      if (token?.name) {
        (session.user as any).name = token.name;
      }

      return session;
    },

    async jwt({ token, user, trigger }: any) {
      // On sign in, attach user info to token
      if (user) {
        token.id = user.id;
        token.role = user.role;

        if (user.name === 'NO_NAME') {
          token.name = user.email.split('@')[0];
          token.needsNameUpdate = true;
          token.userId = user.id;
        } else {
          token.name = user.name;
        }

        if (trigger === 'signIn' || trigger === 'signUp') {
          try {
            const cookieStore = await cookies();
            const sessionCartId = cookieStore.get('sessionCartId')?.value;

            if (sessionCartId) {
              const sessionCart = await prisma.cart.findFirst({
                where: { sessionCartId },
              });

              if (sessionCart) {
                // Delete any existing user cart to avoid duplicates
                await prisma.cart.deleteMany({
                  where: {
                    userId: user.id,
                  },
                });

                // Assign new cart
                await prisma.cart.update({
                  where: {
                    id: sessionCart.id,
                  },
                  data: {
                    userId: user.id,
                  },
                });
              }
            }
          } catch (e) {
            console.error('cart merge error in jwt callback', e);
          }
        }
      }

      return token;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
