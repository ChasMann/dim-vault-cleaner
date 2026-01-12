/**
 * API route for reading and updating app settings.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { settingsSchema } from "@/lib/validation";

/**
 * Returns the singleton settings record.
 */
export const GET = async () => {
  const settings = await prisma.appSetting.findFirst();
  return NextResponse.json(settings ?? { copyWithComment: false, defaultTemplateId: null });
};

/**
 * Updates the settings record, creating it if missing.
 */
export const PUT = async (request: Request) => {
  const body = await request.json();
  const parsed = settingsSchema.parse(body);
  const settings = await prisma.appSetting.upsert({
    where: { id: "singleton" },
    update: {
      copyWithComment: parsed.copyWithComment,
      defaultTemplateId: parsed.defaultTemplateId ?? null
    },
    create: {
      id: "singleton",
      copyWithComment: parsed.copyWithComment,
      defaultTemplateId: parsed.defaultTemplateId ?? null
    }
  });

  return NextResponse.json(settings);
};
