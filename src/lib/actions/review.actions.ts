'use server'
import { Prisma } from "@prisma/client"
import { auth } from "../../../auth"
import { formatError } from "../utils"
import { insertReviewSchema } from "../validators"
import z from "zod"
import { prisma } from "../../../db/prisma"
import { revalidatePath } from "next/cache"

//CREATE AND UPDATE REVIEW

export async function createUpdateReview(data: z.infer<typeof insertReviewSchema>){
 try{
    const session = await auth();
    if(!session) throw new Error("User not authenticated")

   //Validate and store the review
   const review = insertReviewSchema.safeParse({...data, userId: session?.user?.id });//userId is a prt as well

   if (!review.success) {
      return {
        success: false,
        message: formatError(review.error),
      };
    }

    //Get Product being review
    const product = await prisma.product.findFirst({
      where: {id: review.data.productId}
    })
    if(!product) throw new Error("Product not found");

    //Check if user already reviewed the product
    const reviewExists = await prisma.review.findFirst({
      where:{
         productId: review.data.productId,
         userId: review.data.userId
      }
    });


    await prisma.$transaction(async(tx) => {
      if(reviewExists){
         //Update the review
         await tx.review.update({
            where: {id: reviewExists.id},
            data:{
               title: review.data.title,
               description: review.data.description,
               rating: review.data.rating
            }
         })
      }else{
         //Create the review
         await tx.review.create({data: review.data})
      }

      //Get average rating
      const averageRating = await tx.review.aggregate({
         _avg: {rating: true},
         where: {productId: review.data.productId}
      });

      //Get number of reviews
      const numReviews = await tx.review.count({
         where: {productId: review.data.productId}
      });

      //Update the rating and the numReviews in product table
      await tx.product.update({
         where: {id: review.data.productId},
         data:{
            rating: averageRating._avg.rating || 0,
            numReviews
         }
      })
    })

    revalidatePath(`/product/${product.slug}`);

    return { success: true, message: "Review submitted successfully" }
 }catch(error){
    return { success: false, message: formatError(error)}
 }
}


//GET ALL REVIEWS FOR A PRODUCT
export async function getReviews({productId}: {productId: string}) {
  const data = await prisma.review.findMany({
    where: { productId },
    include: { user: {
      select: { name: true, image: true }
    } },
      orderBy: { createdAt: "desc" },
  });
  return {data};
}

//GET REVIEW WRITTEN BY THE CURRENT USER
export async function getReviewByProductId({productId}: {productId: string}){
 const session = await auth();

 if(!session) throw new Error("User is not authenticated");

 return await prisma.review.findFirst({
   where: {productId, userId: session?.user?.id}
 })
}