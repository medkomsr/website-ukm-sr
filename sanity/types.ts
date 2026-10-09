import type { PortableTextBlock } from "@portabletext/react";

export type SanityKabinet = { nama?: string; logoUrl?: string };

export type SanityHomePage = {
  companyVideoUrl?: string;
  companyVideoPosterUrl?: string;
  /** Partner section is not managed in the CMS for now, so the homepage keeps it hidden. */
  partners?: Array<{ name: string; logoUrl?: string; url?: string }>;
};

export type SanityVisiMisi = {
  visi: string;
  misi: string[];
};

export type SanityFaq = {
  _id: string;
  pertanyaan: string;
  jawaban: string;
};

export type EventStatus = "upcoming" | "ongoing" | "completed";

export type SanityActivity = {
  _id: string;
  slug: string;
  type: "event" | "article";
  title: string;
  description: string;
  imageUrl: string;
  gallery?: Array<{ _key: string; imageUrl: string; alt?: string; caption?: string }>;
  category: string;
  date: string;
  status?: EventStatus;
  time?: string;
  location?: string;
  /** Legacy field; no longer projected, so the detail page falls back to `description`. */
  longDescription?: string;
  tags?: string[];
  agenda?: Array<{ time: string; item: string }>;
  body?: PortableTextBlock[];
};

export type SanityDeptMember = {
  imageUrl?: string;
  name: string;
  role: string;
  fakultas?: string;
  angkatan?: string;
};

export type SanityDeptDivisi = {
  name: string;
  kepala?: SanityDeptMember;
  staff: SanityDeptMember[];
};

export type SanityDepartemenCard = {
  fullName?: string;
  _id: string;
  slug: string;
  abbr: string;
  imageUrl?: string;
};

/** CMS members arrive as one ordered list in `divisi[0].staff`; `heading`/`overlay` are UI-only. */
export type SanityDepartemenDetail = {
  programImages?: string[];
  _id: string;
  slug: string;
  heading?: string;
  abbr: string;
  fullName?: string;
  imageUrl?: string;
  overlay?: string;
  description?: string;
  programs?: string[];
  programDescriptions?: string[];
  kepala?: SanityDeptMember;
  divisi: SanityDeptDivisi[];
};

export type SanityPrestasi = {
  field?: string;
  /** Read by the achievement dialog; not managed in the CMS, so it is never set. */
  articleSlug?: string;
  participants?: Array<{
    _key: string;
    name: string;
    faculty?: string;
    imageUrl?: string;
  }>;
  imageUrl?: string;
  imageAlt?: string;
  _id: string;
  title: string;
  description: string;
  year: number;
  category: "Kompetisi" | "Penghargaan" | "Kolaborasi" | "Rekam Jejak";
  level: "Kampus" | "Kota" | "Provinsi" | "Nasional" | "Internasional";
  position?: string;
  organizer?: string;
  location?: string;
};

export type SanityBidangMember = {
  imageUrl?: string;
  name: string;
  role: string;
  fakultas?: string;
  angkatan?: string;
};

export type SanityBidangGalleryItem = {
  imageUrl: string;
  alt: string;
  caption: string;
};

export type SanityBidang = {
  _id: string;
  slug: string;
  heading?: string;
  abbr: string;
  fullName?: string;
  imageUrl?: string;
  overlay?: string;
  description?: string;
  gallery?: SanityBidangGalleryItem[];
  ketuaBidang?: SanityBidangMember;
  wakilKetuaBidang?: SanityBidangMember;
};
export type SanityBidangCard = Pick<
  SanityBidang,
  "_id" | "slug" | "abbr" | "fullName" | "imageUrl"
>;
