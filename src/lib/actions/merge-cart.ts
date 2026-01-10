// lib/actions/merge-cart.ts
"use server";

import { cookies } from "next/headers";
import { prisma } from "../../../db/prisma";

export async function mergeGuestCart(userId: string) {
  const cookieStore = await cookies();
  const sessionCartId = cookieStore.get("sessionCartId")?.value;

  if (!sessionCartId) return;

  const sessionCart = await prisma.cart.findFirst({
    where: { sessionCartId },
  });

  if (!sessionCart) return;

  // Optional: delete old user cart
  await prisma.cart.deleteMany({
    where: { userId },
  });

  await prisma.cart.update({
    where: { id: sessionCart.id },
    data: { userId },
  });

  cookieStore.delete("sessionCartId");
}
