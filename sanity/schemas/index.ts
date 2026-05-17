import { eventSchema } from "./event"
import { artikelSchema } from "./artikel"
import { galeriSchema } from "./galeri"
import { departemenSchema } from "./departemen"
import { siteSettingsSchema } from "./siteSettings"
import { homePageSchema } from "./homePage"
import { visiMisiSchema } from "./visiMisi"
import { divisiSchema } from "./divisi"
import { faqSchema } from "./faq"

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
]
