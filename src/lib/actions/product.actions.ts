"use server";
/* import { PrismaClient } from '../../../src/generated/prisma';
 */ import { convertToPlainObject, formatError } from "../utils";
import { prisma } from "../../../db/prisma";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { revalidatePath } from "next/cache";
//import { Product, UpdateProduct } from "@/Zod-schemas";
import { insertProductSchema, updateProductSchema } from "../validators";
import z from "zod";

//Get products
export async function getLatestProducts() {
  /* generate then migrate then use seed to push and get to read */
  /*     const prisma = new PrismaClient();//initialize
   */
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
  });

  return convertToPlainObject(data); //gives out a typescript object and not a js so it needs to be converted to normal js object
}

//get single data by the slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}

// Get single product by the ID
export async function getProductById(productId: string) {
  const data = await prisma.product.findFirst({
    where: { id: productId },
  });
  console.log(data)

  return convertToPlainObject(data)
}

//Get all productss
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  price,
  rating,
  sort,
  category,
}: {
  query: string;
  limit?: number;
  page: number;
  price?: string;
  rating?: string;
  sort?: string
  category?: string;
}) {
  const whereClause = {
    ...(query ? { name: { contains: query, mode: "insensitive" as const } } : {}),
    ...(category ? { category } : {}),
    ...(sort ? { sort } : {}),
    ...(price ? { price } : {}),
    ...(rating ? { rating } : {}),
  };

  const data = await prisma.product.findMany({
    where: whereClause, // ✅ filter by query and category
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.product.count({ where: whereClause }); // ✅ count only filtered results

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete an order for the Admin
export async function deleteProduct({ Id }: { Id: string }) {
   try{
  const productExists = await prisma.product.findUnique({
    where: { id: Id },
  });

  if (!productExists) throw new Error("Product not found");

  await prisma.product.delete({
    where: { id: Id },
  });

  revalidatePath("/admin/product");
  return { success: true, message: "Product deleted successfully" };
}catch(error){
  return { success: false, message: formatError(error) };
}
}

// Create a product 
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try{
    const product = insertProductSchema.parse(data);
    await prisma.product.create({
      data: product
    })
    revalidatePath('/admin/products');

    return { success: true, message: "Product created successfully" };
  }catch(error){
     return { success: false, message: formatError(error) };
  }
}

// Create a product 
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try{
    const product = updateProductSchema.parse(data);
    const productExists = await prisma.product.findFirst({
      where: {id: product.id}
    })

    if(!productExists) throw new Error('Product not found');

    await prisma.product.update({
     where: {id: product.id},
     data: product
    })
    revalidatePath('/admin/products');

    return { success: true, message: "Product updated successfully" };
  }catch(error){
     return { success: false, message: formatError(error) };
  }
}


// Get all categories

export async function getAllCategories() {
  try {
    const data = await prisma.product.groupBy({
      by: ['category'],
      _count: true,
    });

    return { success: true as const, data };//* Remember to narrow down
  } catch (error) {
    return { success: false as const, message: formatError(error) };
  }
}

// Get featured product
export async function getFeaturedProducts() {
    const data = await prisma.product.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: "desc" },
      take: LATEST_PRODUCTS_LIMIT,
    });
    return convertToPlainObject(data); 
}
