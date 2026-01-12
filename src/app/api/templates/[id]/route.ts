/**
 * API route for updating or deleting a template.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { templateSchema } from "@/lib/validation";

interface RouteParams {
  params: { id: string };
}

/**
 * Updates a template by identifier.
 */
export const PUT = async (request: Request, { params }: RouteParams) => {
  const body = await request.json();
  const parsed = templateSchema.parse(body);
  const template = await prisma.searchTemplate.update({
    where: { id: params.id },
    data: {
      name: parsed.name,
      rules: parsed.rules
    }
  });

  return NextResponse.json(template);
};

/**
 * Deletes a template by identifier.
 */
export const DELETE = async (_request: Request, { params }: RouteParams) => {
  await prisma.searchTemplate.delete({ where: { id: params.id } });
  return NextResponse.json({ status: "ok" });
};
