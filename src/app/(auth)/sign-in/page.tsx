import { Card,CardContent,CardDescription,CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { APP_NAME } from "@/lib/constants"
import CredentialSignInForm from "./credentials-signin-form"

export const metadata = {
  title: 'Sign In'
}

const SignIn = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
      <Link href='/' className="flex-center">
      <Image src="/images/logo.png"  width={100} height={100} alt={`${APP_NAME}`} priority={true}/>
      </Link>
      <CardTitle className="text-center">
      Sign In
      </CardTitle>
      <CardDescription className="text-center">
      Sign into your account
      </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
        {/* FORM */}
        <CredentialSignInForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default SignIn