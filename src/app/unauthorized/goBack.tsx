"use client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
const GoBack = () => {
    const router = useRouter()
    return(<Button asChild onClick={() => router.back()} className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
      <span>Go Back</span>
    </Button>)
}

export default GoBack;