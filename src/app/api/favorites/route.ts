/**
 * API route for listing and creating favorites.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { favoriteSchema } from "@/lib/validation";

/**
 * Lists all favorite searches.
 */
export const GET = async () => {
  const favorites = await prisma.favoriteSearch.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(favorites);
};

/**
 * Creates a new favorite search.
 */
export const POST = async (request: Request) => {
  const body = await request.json();
  const parsed = favoriteSchema.parse(body);
  const favorite = await prisma.favoriteSearch.create({
    data: {
      name: parsed.name,
      templateId: parsed.templateId ?? null,
      selections: parsed.selections
    }
  });

  return NextResponse.json(favorite);
};
