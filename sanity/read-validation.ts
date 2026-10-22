import { z } from "zod";

export const isSafeSlug = (value: unknown): value is string =>
  typeof value === "string" && value.length <= 96 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const text = z.string().max(8000).catch("");
const required = z.string().trim().min(1).max(300);
const slug = z.string().refine(isSafeSlug);
const shortText = z.string().max(200).catch("");
const date = z.iso.date().catch("");
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
export function listOf<T extends z.ZodType>(schema: T, limit = 200) {
  return z
    .array(z.unknown())
    .catch([])
    .transform((items) =>
      items.slice(0, limit).flatMap((item) => {
        const result = schema.safeParse(item);
        return result.success ? [result.data] : [];
      }),
    );
}
const strings = listOf(z.string().max(500));
const member = z.object({ name: required, role: text, imageUrl: image });
export const profileCard = z.object({
  _id: required,
  slug,
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
  programs: z
    .array(text)
    .catch([])
    .transform((items) => items.slice(0, 100)),
  programDescriptions: z
    .array(text)
    .catch([])
    .transform((items) => items.slice(0, 100)),
  programImages: z
    .array(image)
    .catch([])
    .transform((items) => items.slice(0, 100)),
  divisi: listOf(z.object({ name: text, staff: listOf(member) })),
});
const block = z.object({
  _key: text,
  _type: z.literal("block"),
  style: z
    .enum(["normal", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote"])
    .optional()
    .catch(undefined),
  listItem: z.enum(["bullet", "number"]).optional().catch(undefined),
  level: z.number().int().min(1).max(6).optional().catch(undefined),
  children: listOf(z.object({ _type: z.literal("span"), _key: text, text, marks: strings })),
  markDefs: listOf(
    z.object({
      _key: required,
      _type: required,
      href: z
        .string()
        .max(2048)
        .refine(
          (v) => !/[\\\u0000-\u0020\u007f]/.test(v) && /^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(v),
        )
        .optional(),
    }),
  ),
});
export const activityIdentity = z.object({
  _id: required,
  slug,
  type: z.enum(["article", "event"]),
  title: required,
});
export const activityContent = activityIdentity.extend({
  description: text,
  imageUrl: image,
  category: shortText,
  date,
  status: z.enum(["upcoming", "ongoing", "completed"]).optional().catch(undefined),
  time: text,
  location: text,
  tags: strings,
  body: listOf(block),
  agenda: listOf(z.object({ time: text, item: required })),
  gallery: listOf(z.object({ _key: text, imageUrl: image, alt: text, caption: text })),
});
export const achievementIdentity = z.object({
  _id: required,
  title: required,
  year: z.number().int().min(2000).max(2100),
  category: z.enum(["Kompetisi", "Penghargaan", "Kolaborasi", "Rekam Jejak"]),
  level: z.enum(["Kampus", "Kota", "Provinsi", "Nasional", "Internasional"]),
});
export const achievementContent = achievementIdentity.extend({
  description: text,
  position: shortText,
  field: text,
  organizer: text,
  location: text,
  imageUrl: image,
  imageAlt: text,
  participants: listOf(z.object({ _key: text, name: required, faculty: text, imageUrl: image })),
});
export const visionContent = z.object({ visi: text, misi: strings });
export const cabinetContent = z.object({ nama: text, logoUrl: image });
export const faqContent = z.object({
  _id: required,
  pertanyaan: required,
  jawaban: z.string().trim().min(1).max(8000),
});
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
