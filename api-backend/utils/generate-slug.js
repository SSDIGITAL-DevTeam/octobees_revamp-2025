import { like } from "drizzle-orm";
import { db } from "../drizzle/db.js";

export const generateUniqueSlug = async (baseSlug, tblname, tblslug) => {
  const existingSlugs = await db
    .select()
    .from(tblname)
    .where(like(tblslug, `${baseSlug}%`));

  if (existingSlugs.length === 0) {
    return baseSlug;
  }

  const slugNumbers = existingSlugs
    .map((item) => {
      const match = item.slug.match(/-(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((num) => num !== null);

  const maxNumber = slugNumbers.length > 0 ? Math.max(...slugNumbers) : 0;
  return `${baseSlug}-${maxNumber + 1}`;
};
