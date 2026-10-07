import type { PortableTextBlock } from "@portabletext/react";
import type { Image, ImageDimensions } from "sanity";

export type SanitySiteSettings = {
  kabinetNama?: string;
  kabinetLogoUrl?: string;
  /** Not managed in the CMS; the profile eyebrow shows the cabinet name only. */
  kabinetPeriode?: string;
  namaOrg: string;
  tagline: string;
  tahunBerdiri: number;
  jumlahAnggota: string;
  jumlahPenghargaan: string;
  jumlahKegiatan: string;
  alamat: string;
  telepon: string;
  email: string;
  instagram: string;
  instagramUrl: string;
  youtube: string;
  youtubeUrl: string;
  facebook: string;
  facebookUrl: string;
};

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

export type SanityDivisi = {
  _id: string;
  nama: string;
  subtitle: string;
  deskripsi: string;
  jumlahAnggota: number;
  ikon: string;
  accent: string;
  imageUrl: string | null;
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

export type SanityGalleryItem = {
  _id: string;
  imageUrl: string;
  alt: string;
  caption: string;
  category?: string;
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

export type SanityKaligrafiStatus = "available" | "sold";

export type SanityKaligrafiCategory = {
  _id: string;
  name: string;
  slug: string;
  displayOrder: number;
};

export type SanityKaligrafiItem = {
  _id: string;
  title: string;
  code: string;
  image: Image;
  alt: string;
  category: SanityKaligrafiCategory;
  price: number;
  description?: string;
  status: SanityKaligrafiStatus;
  soldAt?: string;
  displayOrder: number;
  imageLqip: string | null;
  imageDimensions: ImageDimensions | null;
};

export type SanityKaligrafiCatalogPage = {
  items: SanityKaligrafiItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type SanityKaligrafiCatalogMeta = {
  categories: SanityKaligrafiCategory[];
  whatsappNumber: string | null;
};
