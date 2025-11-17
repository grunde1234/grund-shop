import NextAuth from 'next-auth';
import {PrismaAdapter} from '@auth/prisma-adapter'
import {prisma} from "./db/prisma"
import CredentialsProvider from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';

export const config: NextAuthConfig = {
    pages:{
  signIn: '/sign-in',
  /* signOut: '/signout', */
  error: '/sign-in', // Error code passed in query string as ?error=
  /* verifyRequest: '/auth/verify-request', */ // (used for check email message)
  /* newUser: '/auth/new-user' */ // New users will be directed here on first sign in (leave the property out if not of interest)
    },
    session:{
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    adapter: PrismaAdapter(prisma),
    providers:[//field to add m/ore providers like google, facebook, twitter etc to login
        CredentialsProvider({
            credentials:{
                email: {label: "Email", type: "text", placeholder: "Email"},
                password: {label: "Password", type: "password", placeholder: "Password"}
            },
            async authorize(credentials) {
  if (!credentials?.email || !credentials?.password) return null;

  const user = await prisma.user.findFirst({
    where: { email: credentials.email as string }
  });

  if (!user) return null;

  // Compare hashed password
  const isMatch = compareSync(credentials.password as string, user.password as string);

  if (!isMatch) return null;

  // Return minimal user object
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

        })
    ],
    callbacks:{
    async session({ session, user, trigger, token}: any) {
    //set user Id from the token
    session.user.id = token.sub;
    session.user.role = token.role;
    session.user.name = token.name;
  
    console.log(token)
    //if update then set user name
    if (trigger === 'update') {
        session.user.name = user.name;
    }
    return session
  },
    async jwt({ token, user, trigger, session }: any) {
    //assign user info to token at sign in
    if(user){
        token.role = user.role;
        //if user has no name use email

        if(user.name==='NO_NAME'){
            token.name = user.email.split('@')[0];

            //update name in db
            await prisma.user.update({
                where: {id: user.id},
                data: {name: token.name}
            });
        }

    }
    return token;
  }
    }
};

export const {handlers, auth, signIn, signOut} = NextAuth(config)//?