import { auth } from "../../../../auth";
import {SessionProvider} from "next-auth/react"
import ProfileForm from "./profile-form";

export const metadata = {
  title: 'Customer Profile'
}

const Profile = async() => {
  const session = await auth()
  return (
    <SessionProvider session={session}>
      <div className="max-w-md mx-auto space-y-4">
        <div className="h2-bold">User Profile</div>
      {/*   {session?.user?.name} */}
      <ProfileForm />
      </div>
    </SessionProvider>
  )
}

export default Profile