'use client'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { signInDefaultValues } from "@/lib/constants"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {signinWithCredentials} from "@/lib/actions/user.actions"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Loader } from "lucide-react"
const CredentialSignInForm = () => {
  const [data, action] = useActionState(signinWithCredentials, {success: false, message: ' '}) 
   
  const SignInButton = ()=>{
    const {pending} = useFormStatus()

    return(
      <Button disabled={pending} className="w-full">
        {pending ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In'}
      </Button>
    )
  }

  return (
    <form className="space-y-4" action={action}>
        <div>
        <Label htmlFor="email" className="block text-sm font-medium">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" defaultValue={signInDefaultValues.email} />
        </div>
        <div>
        <Label htmlFor="password" className="block text-sm font-medium">Password</Label>
        <Input id="password" name="password" type="password" required autoComplete="password" defaultValue={signInDefaultValues.password} />
        </div>
        <div>
           <SignInButton />
        </div>
        {/* Error message */}
        {data && !data.success && (
          <div className="text-center text-destructive">
            {
            data.message
            }
          </div>
        )}

        <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account? <Link href="/sign-up" target="_blank" className="text-primary hover:underline">Sign Up</Link>
        </div>
    </form>
  )
}

export default CredentialSignInForm