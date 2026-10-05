import { eventSchema } from "@/sanity/schemas/event";
import { artikelSchema } from "@/sanity/schemas/artikel";
import { galeriSchema } from "@/sanity/schemas/galeri";
import { departemenSchema } from "@/sanity/schemas/departemen";
import { siteSettingsSchema } from "@/sanity/schemas/siteSettings";
import { homePageSchema } from "@/sanity/schemas/homePage";
import { visiMisiSchema } from "@/sanity/schemas/visiMisi";
import { divisiSchema } from "@/sanity/schemas/divisi";
import { faqSchema } from "@/sanity/schemas/faq";
import { prestasiSchema } from "@/sanity/schemas/prestasi";
import { bidangSchema } from "@/sanity/schemas/bidang";
import { kaligrafiCategorySchema } from "@/sanity/schemas/kaligrafiCategory";
import { kaligrafiItemSchema } from "@/sanity/schemas/kaligrafiItem";
import { kaligrafiSettingsSchema } from "@/sanity/schemas/kaligrafiSettings";

export const schemaTypes = [
  siteSettingsSchema,
  homePageSchema,
  visiMisiSchema,
  eventSchema,
  artikelSchema,
  divisiSchema,
  galeriSchema,
  departemenSchema,
  faqSchema,
  prestasiSchema,
  bidangSchema,
  kaligrafiCategorySchema,
  kaligrafiItemSchema,
  kaligrafiSettingsSchema,
];
