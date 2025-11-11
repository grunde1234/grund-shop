import { Card,CardContent,CardDescription,CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { APP_NAME } from "@/lib/constants"
//import CredentialSignInForm from "./credentials-signin-form"
import { redirect } from "next/navigation"
import { auth } from "../../../../auth"
import SignUpForm from "./sign-up-form"

export const metadata = {
  title: 'Sign Up'
}

const SignUpPage = async(props: {searchParams: Promise <{callbackUrl: string }>}) => {

  const {callbackUrl} = await props.searchParams;

  const session = await auth();
  if(session){
    redirect(callbackUrl || '/')
  }
  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
      <Link href='/' className="flex-center">
      <Image src="/images/logo.png"  width={100} height={100} alt={`${APP_NAME}`} priority={true}/>
      </Link>
      <CardTitle className="text-center">
        Sign Up
      </CardTitle>
      <CardDescription className="text-center">
      Create a new account
      </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
        <SignUpForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUpPage