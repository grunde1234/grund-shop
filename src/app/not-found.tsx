"use client"
import {APP_NAME} from '@/lib/constants'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import { ArrowBigLeft } from "lucide-react"

const NotFound = () => {
    const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
        <Image src='/images/logo.png' width={48} height={48} alt={APP_NAME} priority={true} />
        <div className="p-6 w-1/3 rounded-lg shadow-lg dark:shadow-blue-100 text-center">
        <h1 className="text-2xl font-bold mb-4">
            Not Found
        </h1>
        <p className="text-destructive">Could Not Find Page</p>
        <button
        variant="outline"
        className="mt-4 ml-2 cursor-pointer" onClick={()=> router.back()}>
            <ArrowBigLeft />
        </button>
        </div>
    </div>
  )
}

export default NotFound