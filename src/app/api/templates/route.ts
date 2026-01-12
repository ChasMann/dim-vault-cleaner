/**
 * API route for listing and creating search templates.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { templateSchema } from "@/lib/validation";
import { getDefaultTemplate } from "@/lib/defaults";

/**
 * Returns all templates, seeding a default template on first run.
 */
export const GET = async () => {
  const templates = await prisma.searchTemplate.findMany({ orderBy: { createdAt: "asc" } });

  if (templates.length === 0) {
    const defaultTemplate = getDefaultTemplate();
    const created = await prisma.searchTemplate.create({
      data: {
        name: defaultTemplate.name,
        rules: defaultTemplate.rules
      }
    });
    return NextResponse.json([created]);
  }

  return NextResponse.json(templates);
};

/**
 * Creates a new search template.
 */
export const POST = async (request: Request) => {
  const body = await request.json();
  const parsed = templateSchema.parse(body);
  const template = await prisma.searchTemplate.create({
    data: {
      name: parsed.name,
      rules: parsed.rules
    }
  });

  return NextResponse.json(template);
};
