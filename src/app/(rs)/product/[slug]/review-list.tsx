"use client"
import { useState } from "react";
import { Review } from "@/Zod-schemas";
import Link from "next/link";

type props = {
    userId: string,
    productId: string,
    productSlug: string
}


const ReviewList = ({userId, productId, productSlug}: props) => {
 //console.log(userId, productId, productSlug);

 const [reviews, setReviews] = useState<Review[]>([])
  return (
    <div className="space-y-4">
    {reviews.length === 0 && <div>No reviews yet</div>}
    {
      userId ? (
        <>{/* REVIEW FORM */}</>
      ) : (
        <div>
          Please <Link className="text-blue-700 font-bold px-2" href={`/sign-in?callbackUrl=/product/${productSlug}`}>sign in</Link> to write a review
        </div>
      )
    }
    <div className="flex flex-col gap-3">
      {/* Reviews here */}
    </div>
    </div>
  )
}

export default ReviewList