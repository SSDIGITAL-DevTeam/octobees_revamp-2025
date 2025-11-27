// src/utils/slugify.ts

export const slugify = (value: string | null | undefined) => {
  const safe = (value ?? "").toString() // kalau undefined/null jadi ""

  return safe
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}
