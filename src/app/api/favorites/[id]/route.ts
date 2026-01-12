/**
 * API route for updating and deleting favorites.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { favoriteSchema } from "@/lib/validation";

interface RouteParams {
  params: { id: string };
}

/**
 * Updates a favorite search entry.
 */
export const PUT = async (request: Request, { params }: RouteParams) => {
  const body = await request.json();
  const parsed = favoriteSchema.parse(body);
  const favorite = await prisma.favoriteSearch.update({
    where: { id: params.id },
    data: {
      name: parsed.name,
      templateId: parsed.templateId ?? null,
      selections: parsed.selections
    }
  });

  return NextResponse.json(favorite);
};

/**
 * Deletes a favorite search entry.
 */
export const DELETE = async (_request: Request, { params }: RouteParams) => {
  await prisma.favoriteSearch.delete({ where: { id: params.id } });
  return NextResponse.json({ status: "ok" });
};
