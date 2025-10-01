'use server'
/* import { PrismaClient } from '../../../src/generated/prisma';
 */import { convertToPlainObject } from '../utils';
import {prisma} from '../../../db/prisma'
import { LATEST_PRODUCTS_LIMIT } from '../constants';

//Get products
export async function getLatestProducts(){/* generate then migrate then use seed to push and get to read */
/*     const prisma = new PrismaClient();//initialize
 */
    const data = await prisma.product.findMany({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy:{
            createdAt: 'desc'
        }
    })

    return convertToPlainObject(data)
}