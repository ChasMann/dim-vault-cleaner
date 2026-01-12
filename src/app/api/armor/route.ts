/**
 * API route for armor set tracker CRUD operations.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { armorSetSchema } from "@/lib/validation";

/**
 * Lists all armor sets.
 */
export const GET = async () => {
  const sets = await prisma.armorSet.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(sets);
};

/**
 * Creates a new armor set.
 */
export const POST = async (request: Request) => {
  const body = await request.json();
  const parsed = armorSetSchema.parse(body);
  const set = await prisma.armorSet.create({
    data: {
      name: parsed.name,
      notes: parsed.notes ?? null,
      sections: parsed.sections
    }
  });

  return NextResponse.json(set);
};
