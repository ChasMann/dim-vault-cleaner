/**
 * API route for updating or deleting wishlist files.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { wishlistFileSchema } from "@/lib/validation";

interface RouteParams {
  params: { id: string };
}

/**
 * Updates a wishlist file.
 */
export const PUT = async (request: Request, { params }: RouteParams) => {
  const body = await request.json();
  const parsed = wishlistFileSchema.parse(body);
  const file = await prisma.wishlistFile.update({
    where: { id: params.id },
    data: {
      name: parsed.name,
      title: parsed.title ?? null,
      description: parsed.description ?? null,
      entries: parsed.entries
    }
  });

  return NextResponse.json(file);
};

/**
 * Deletes a wishlist file.
 */
export const DELETE = async (_request: Request, { params }: RouteParams) => {
  await prisma.wishlistFile.delete({ where: { id: params.id } });
  return NextResponse.json({ status: "ok" });
};
