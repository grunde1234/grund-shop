'use server'
import { signinFromSchema } from "../validators"
import { signIn, signOut } from "../../../auth"
import { isRedirectError } from "next/dist/client/components/redirect-error"

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