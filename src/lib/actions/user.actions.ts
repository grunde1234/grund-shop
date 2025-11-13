'use server'
import { signinFromSchema, signupFromSchema } from "../validators"
import { signIn, signOut } from "../../../auth"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { hashSync } from "bcrypt-ts-edge"
import { prisma } from "../../../db/prisma"
import {formatError} from "../utils"

//sign in user with credentials
export async function signinWithCredentials(prevState: unknown, formData: FormData) {
    try{
        const user = signinFromSchema.parse({
            email: formData.get('email'),
            password: formData.get('password')
        });

        await signIn('credentials', user);

        return {success: true, message: 'Signed in successfully'}//actionStates
    }catch(error){
        if(isRedirectError(error)){
            throw error;
        }
        return {success: false, message: 'Invalid email or password'}//actionStates which is thrown back to user in the frontend
    }
}

//signOut user
export async function signOutUser(){
    await signOut();
}

//sign up user with credentials
export async function signupUser(prevState: unknown, formData: FormData) {
    try{
        const user = signupFromSchema.parse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
        });

        const plainPassword = user.password; //set before hashing
        //hash password
        user.password = hashSync(user.password, 10);

        //create user in db
        await prisma.user.create({
            data:{
                name: user.name,
                email: user.email,
                password: user.password,
                /* role: 'USER' */
            }
        });
        await signIn('credentials', {email: user.email, password: plainPassword,});

        return {success: true, message: 'User signed up successfully'}//actionStates
    }catch(error){
       /*  console.log(error.name);
        console.log(error.code);
        console.log(error.errors);
        console.log(error.meta?.target); */ //for prisma errors

         if(isRedirectError(error)){
            throw error;
        }
        return {success: false, message: formatError(error)}//actionStates which is thrown back to user in the frontend
    }
}