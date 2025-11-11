'use client'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { signUpDefaultValues } from "@/lib/constants"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {signupUser} from "@/lib/actions/user.actions"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Loader } from "lucide-react"
import { useSearchParams } from "next/navigation"
const SignUpForm = () => {
  const [data, action] = useActionState(signupUser, {success: false, message: ' '}) 

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const SignUpButton = ()=>{
    const {pending} = useFormStatus()

    return(
      <Button disabled={pending} className="w-full">
        {pending ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In'}
      </Button>
    )
  }

  return (
    <form className="space-y-4" action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />{/* persists to next page */}
        <div>
        <Label htmlFor="name" className="block text-sm font-medium">Name</Label>
        <Input id="name" name="name" type="text" required autoComplete="name" defaultValue={signUpDefaultValues.name} />
        </div>
        <div>
        <Label htmlFor="email" className="block text-sm font-medium">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" defaultValue={signUpDefaultValues.email} />
        </div>
        <div>
        <Label htmlFor="password" className="block text-sm font-medium">Password</Label>
        <Input id="password" name="password" type="password" required autoComplete="password" defaultValue={signUpDefaultValues.password} />
        </div>
        <div>
        <Label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required autoComplete="confirm-password" defaultValue={signUpDefaultValues.confirmPassword} />
        </div>
        <div>
           <SignUpButton />
        </div>
        {/* Error message */}
        {data && !data.success && ( //if the action to sign up failed pop out this message
          <div className="text-center text-destructive">
            {
            data.message
            }
          </div>
        )}
        {/*  */}

        <div className="text-sm text-center text-muted-foreground">
            Already have an account? <Link href="/sign-in" target="_self" className="text-primary hover:underline">Sign In</Link>
        </div>
    </form>
  )
}

export default SignUpForm