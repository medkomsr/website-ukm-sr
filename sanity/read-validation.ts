import { z } from "zod";

const text = z.string().catch("");
const required = z.string().trim().min(1);
const image = z
  .string()
  .url()
  .refine((value) => {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === "cdn.sanity.io" &&
      url.pathname.startsWith(
        `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/`,
      )
    );
  })
  .catch("");
export function listOf<T extends z.ZodType>(schema: T) {
  return z
    .array(z.unknown())
    .catch([])
    .transform((items) =>
      items.flatMap((item) => {
        const result = schema.safeParse(item);
        return result.success ? [result.data] : [];
      }),
    );
}
const strings = listOf(z.string());
const member = z.object({ name: required, role: text, imageUrl: image });
export const profileCard = z.object({
  _id: required,
  slug: required,
  abbr: required,
  fullName: text,
  imageUrl: image,
});
export const fieldContent = profileCard.extend({
  description: text,
  ketuaBidang: member.optional().catch(undefined),
  wakilKetuaBidang: member.optional().catch(undefined),
  gallery: listOf(z.object({ imageUrl: image, alt: text, caption: text })),
});
export const departmentContent = profileCard.extend({
  programs: z.array(text).catch([]),
  programDescriptions: z.array(text).catch([]),
  programImages: z.array(image).catch([]),
  divisi: listOf(z.object({ name: text, staff: listOf(member) })),
});
const block = z.object({
  _key: text,
  _type: z.literal("block"),
  style: z.string().optional(),
  listItem: z.string().optional(),
  level: z.number().optional(),
  children: listOf(z.object({ _type: z.literal("span"), _key: text, text, marks: strings })),
  markDefs: listOf(
    z.object({
      _key: required,
      _type: required,
      href: z
        .string()
        .refine((v) => /^(https?:\/\/|mailto:|\/|#)/i.test(v))
        .optional(),
    }),
  ),
});
export const activityContent = z.object({
  _id: required,
  slug: required,
  type: z.enum(["article", "event"]),
  title: required,
  description: text,
  imageUrl: image,
  category: text,
  date: text,
  status: z.enum(["upcoming", "ongoing", "completed"]).optional().catch(undefined),
  time: text,
  location: text,
  tags: strings,
  body: listOf(block),
  agenda: listOf(z.object({ time: text, item: required })),
  gallery: listOf(z.object({ _key: text, imageUrl: image, alt: text, caption: text })),
});
export const achievementContent = z.object({
  _id: required,
  title: required,
  description: text,
  year: z.number().int().min(2000).max(2100),
  category: z.enum(["Kompetisi", "Penghargaan", "Kolaborasi", "Rekam Jejak"]),
  level: z.enum(["Kampus", "Kota", "Provinsi", "Nasional", "Internasional"]),
  position: text,
  field: text,
  organizer: text,
  location: text,
  imageUrl: image,
  imageAlt: text,
  participants: listOf(z.object({ _key: text, name: required, faculty: text, imageUrl: image })),
});
export const visionContent = z.object({ visi: text, misi: strings });
export const cabinetContent = z.object({ nama: text, logoUrl: image });
export const faqContent = z.object({ _id: required, pertanyaan: required, jawaban: required });
export const activityMeta = z.object({ categories: strings, featured: listOf(activityContent) });
export const achievementMeta = z.object({
  total: z.number().nonnegative().catch(0),
  years: listOf(z.number().int()),
  fields: strings,
  categories: strings,
});

export function readOne<T extends z.ZodType>(schema: T, value: unknown): z.output<T> | null {
  const result = schema.safeParse(value);
  return result.success ? result.data : null;
}
export const isSafeSlug = (value: unknown): value is string =>
  typeof value === "string" && value.length <= 96 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
