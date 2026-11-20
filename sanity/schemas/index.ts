import { beritaAcaraSchema } from "@/sanity/schemas/beritaAcara";
import { departemenSchema } from "@/sanity/schemas/departemen";
import { homePageSchema } from "@/sanity/schemas/homePage";
import { visiMisiSchema } from "@/sanity/schemas/visiMisi";
import { kabinetSchema } from "@/sanity/schemas/kabinet";
import { faqSchema } from "@/sanity/schemas/faq";
import { prestasiSchema } from "@/sanity/schemas/prestasi";
import { bidangSchema } from "@/sanity/schemas/bidang";

export const schemaTypes = [
  homePageSchema,
  visiMisiSchema,
  kabinetSchema,
  beritaAcaraSchema,
  departemenSchema,
  faqSchema,
  prestasiSchema,
  bidangSchema,
];
