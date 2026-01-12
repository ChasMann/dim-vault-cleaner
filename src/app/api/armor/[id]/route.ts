/**
 * API route for updating or deleting armor sets.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { armorSetSchema } from "@/lib/validation";

interface RouteParams {
  params: { id: string };
}

/**
 * Updates an armor set and its embedded sections.
 */
export const PUT = async (request: Request, { params }: RouteParams) => {
  const body = await request.json();
  const parsed = armorSetSchema.parse(body);
  const set = await prisma.armorSet.update({
    where: { id: params.id },
    data: {
      name: parsed.name,
      notes: parsed.notes ?? null,
      sections: parsed.sections
    }
  });

  return NextResponse.json(set);
};

/**
 * Deletes an armor set.
 */
export const DELETE = async (_request: Request, { params }: RouteParams) => {
  await prisma.armorSet.delete({ where: { id: params.id } });
  return NextResponse.json({ status: "ok" });
};
