/**
 * API route for resetting local data during development or cleanup.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Clears all user data tables while preserving schema.
 */
export const POST = async () => {
  await prisma.favoriteSearch.deleteMany();
  await prisma.searchTemplate.deleteMany();
  await prisma.armorSet.deleteMany();
  await prisma.wishlistFile.deleteMany();
  await prisma.appErrorLog.deleteMany();
  await prisma.appSetting.deleteMany();

  return NextResponse.json({ status: "reset" });
};
