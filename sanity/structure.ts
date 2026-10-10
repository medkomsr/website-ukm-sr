import type { StructureBuilder, StructureResolver } from "sanity/structure";
import { apiVersion } from "@/sanity/env";
import { bidangPresets, departemenPresets, presetDocumentId } from "@/sanity/presets";

/** Ready-made documents for every public card, plus a list for anything added later. */
const presetGroup = (
  S: StructureBuilder,
  type: "departemen" | "bidang",
  title: string,
  presets: Array<{ abbr: string; slug: string }>,
) => {
  const ids = presets.flatMap(({ slug }) => {
    const id = presetDocumentId(type, slug);
    return [id, `drafts.${id}`];
  });
  return S.listItem()
    .title(title)
    .id(type)
    .child(
      S.list()
        .title(title)
        .items([
          ...presets.map(({ abbr, slug }) =>
            S.listItem()
              .title(abbr)
              .id(presetDocumentId(type, slug))
              .schemaType(type)
              .child(
                S.document()
                  .schemaType(type)
                  .documentId(presetDocumentId(type, slug))
                  .initialValueTemplate(`${type}-preset`, { abbr, slug }),
              ),
          ),
          S.divider(),
          S.listItem()
            .title("Lainnya")
            .id(`${type}-lainnya`)
            .child(
              S.documentList()
                .title(`${title} lainnya`)
                .schemaType(type)
                .apiVersion(apiVersion)
                .filter(`_type == $type && !(_id in $ids)`)
                .params({ type, ids })
                .initialValueTemplates([S.initialValueTemplateItem(type)]),
            ),
        ]),
    );
};

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Konten")
    .items([
      S.listItem()
        .title("Beranda")
        .id("beranda")
        .child(S.document().schemaType("homePage").documentId("homePage").title("Beranda")),
      S.listItem()
        .title("Tentang Kami")
        .id("tentangKami")
        .child(
          S.list()
            .title("Tentang Kami")
            .items([
              S.listItem()
                .title("Visi & Misi")
                .id("visiMisi")
                .child(S.document().schemaType("visiMisi").documentId("visiMisi")),
              S.listItem()
                .title("Kabinet")
                .id("kabinet")
                .child(S.document().schemaType("kabinet").documentId("kabinet")),
              presetGroup(S, "departemen", "Pengurus Departemen", departemenPresets),
              presetGroup(S, "bidang", "Pengurus Bidang", bidangPresets),
            ]),
        ),
      S.documentTypeListItem("beritaAcara").title("Berita & Acara"),
      S.listItem()
        .title("Prestasi")
        .id("prestasi")
        .schemaType("prestasi")
        .child(
          S.documentTypeList("prestasi")
            .title("Prestasi")
            .defaultOrdering([
              { field: "year", direction: "desc" },
              { field: "_createdAt", direction: "desc" },
            ]),
        ),
      S.listItem()
        .title("Hubungi Kami")
        .id("hubungiKami")
        .child(
          S.list()
            .title("Hubungi Kami")
            .items([
              S.listItem()
                .title("FAQ")
                .id("faq")
                .child(S.document().schemaType("faq").documentId("faq")),
            ]),
        ),
    ]);
