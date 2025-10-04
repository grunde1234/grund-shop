'use client'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { signInDefaultValues } from "@/lib/constants"
import { Button } from "@/components/ui/button"
const CredentialSignInForm = () => {
  return (
    <form className="space-y-4">
        <div>
        <Label htmlFor="email" className="block text-sm font-medium">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" defaultValue={signInDefaultValues.email} />
        </div>
        <div>
        <Label htmlFor="password" className="block text-sm font-medium">Password</Label>
        <Input id="password" name="password" type="password" required autoComplete="password" defaultValue={signInDefaultValues.password} />
        </div>
        <div>
            <Button type="submit" className="w-full hover:opacity-80 hover:cursor-pointer" variant="default">Sign In</Button>
        </div>
        <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account? <a href="/sign-up" target="_blank" className="text-primary hover:underline">Sign Up</a>
        </div>
    </form>
  )
}

export default CredentialSignInForm