import type { Metadata } from 'next'
import GoBack from "./goBack"
export const metadata:Metadata = {
    title: "Unauthorize Access"
}
const Unauthorized = () => {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center space-y-4 h-[calc(100vh-200px)]"><h1 className="h1-bold text-4xl">Unauthorized Access</h1>
    <p className="text-muted-foreground">You do not have permission to access this page</p>
    <GoBack />
    </div>
  )
}

export default Unauthorized