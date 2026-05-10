"use server";
/* import { PrismaClient } from '../../../src/generated/prisma';
 */ import { convertToPlainObject } from "../utils";
import { prisma } from "../../../db/prisma";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";

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

//Get all productss
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
}) {
  const data = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.product.count();

  return{
    data,
    totalPages: Math.ceil(dataCount/limit)
  }
}
