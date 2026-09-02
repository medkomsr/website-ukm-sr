import { eventSchema } from "./event"
import { artikelSchema } from "./artikel"
import { galeriSchema } from "./galeri"
import { departemenSchema } from "./departemen"
import { siteSettingsSchema } from "./siteSettings"
import { homePageSchema } from "./homePage"
import { visiMisiSchema } from "./visiMisi"
import { faqSchema } from "./faq"
import { prestasiSchema } from "./prestasi"
import { bidangSchema } from "./bidang"

export const schemaTypes = [
  siteSettingsSchema,
  homePageSchema,
  visiMisiSchema,
  eventSchema,
  artikelSchema,
  galeriSchema,
  departemenSchema,
  faqSchema,
  prestasiSchema,
  bidangSchema,
]
