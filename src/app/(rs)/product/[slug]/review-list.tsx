"use client";
import { useState } from "react";
import { Review } from "@/Zod-schemas";
import Link from "next/link";
import ReviewForm from "./review-form";
import { getReviews } from "@/lib/actions/review.actions";
import { useEffect } from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import { Calendar, User } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import Rating from "@/components/shared/product/rating";

type props = {
  userId: string;
  productId: string;
  productSlug: string;
};

const ReviewList = ({ userId, productId, productSlug }: props) => {
  //console.log(userId, productId, productSlug);

  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(()=>{
    const loadReviews = async()=>{
      const res = await getReviews({productId});

      setReviews(res.data);

    }

    loadReviews();
  },[productId])

  const reload = () =>{
    console.log('review submitted');
  }
  return (
    <div className="space-y-4">
      {reviews.length === 0 && <div>No reviews yet</div>}
      {userId ? (
        <>
        {/* REVIEW FORM */}
        <ReviewForm userId={userId} productId={productId} onReviewSubmitted={reload} />
        </>
      ) : (
        <div>
          Please{" "}
          <Link
            className="text-blue-700 font-bold px-2"
            href={`/sign-in?callbackUrl=/product/${productSlug}`}
          >
            sign in
          </Link>{" "}
          to write a review
        </div>
      )}
      <div className="flex flex-col gap-3">
        {/* Reviews here */}
        {reviews.map((r)=>(
          <Card key={r.id}>
            <CardHeader>
              <div className="flex-between">
                <CardTitle>
                  {r.title}
                </CardTitle>
              </div>
              <CardDescription>
                {r.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 text-sm text-muted-foreground">
                {/* RATING */}
                <Rating value={r.rating}/>
                <div className="flex item-center">
                  <User className="mr-1 h-3 w-3" />
                  {r.user ? r.user.name : 'User'}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-3 h-3 w-3" />
                  {formatDateTime(r.createdAt).dateTime}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
    </div>
  );
};

export default ReviewList;
