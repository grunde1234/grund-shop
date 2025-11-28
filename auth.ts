import NextAuth from 'next-auth';
import {PrismaAdapter} from '@auth/prisma-adapter'
import {prisma} from "./db/prisma"
import CredentialsProvider from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

export const config: NextAuthConfig = {
    pages:{
        signIn: '/sign-in',
        error: '/sign-in',
    },
    session:{
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    adapter: PrismaAdapter(prisma),
    providers:[
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
                return { 
                    id: user.id, 
                    name: user.name, 
                    email: user.email, 
                    role: user.role 
                };
            }
        })
    ],
    callbacks:{
        async session({ session, token }: any) {
            // Set user Id from the token
            session.user.id = token.sub;
            session.user.role = token.role;
            session.user.name = token.name;
            
            return session;
        },
        
        async jwt({ token, user, trigger, account }: any) {
            // Assign user info to token at sign in
            if (user) {
                token.role = user.role;
                
                // If user has no name, use email prefix
                if (user.name === 'NO_NAME') {
                    token.name = user.email.split('@')[0];
                    // Mark that we need to update the database
                    token.needsNameUpdate = true;
                    token.userId = user.id;
                } else {
                    token.name = user.name;
                }
            }
            
            return token;
        },
        
        /* authorized({ request, auth }: any) {
            // Check for session cart cookie
            if (!request.cookies.get('sessionCartId')) {
                // Create a new cart session cookie
                const sessionCartId = crypto.randomUUID();
                
                // Clone request headers
                const newRequestHeaders = new Headers(request.headers);
                
                // Create a new response and add new headers
                const response = NextResponse.next({
                    request: {
                        headers: newRequestHeaders
                    }
                });
                
                console.log('New cart session:', sessionCartId);
                
                // Set newly generated cart id to cookie
                response.cookies.set('sessionCartId', sessionCartId, {
                    path: '/', 
                    maxAge: 60 * 60 * 24 * 7 // 7 days
                });
                
                return response;
            }
            
            return true;
        } */
    }
};

export const {handlers, auth, signIn, signOut} = NextAuth(config);