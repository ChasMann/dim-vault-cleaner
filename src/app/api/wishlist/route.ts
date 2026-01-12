/**
 * API route for wishlist files.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { wishlistFileSchema } from "@/lib/validation";

/**
 * Lists all wishlist files.
 */
export const GET = async () => {
  const files = await prisma.wishlistFile.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(files);
};

/**
 * Creates a new wishlist file.
 */
export const POST = async (request: Request) => {
  const body = await request.json();
  const parsed = wishlistFileSchema.parse(body);
  const file = await prisma.wishlistFile.create({
    data: {
      name: parsed.name,
      title: parsed.title ?? null,
      description: parsed.description ?? null,
      entries: parsed.entries
    }
  });

  return NextResponse.json(file);
};
