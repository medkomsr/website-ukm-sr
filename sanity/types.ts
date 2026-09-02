import type { PortableTextBlock } from "@portabletext/react"

export type SanitySiteSettings = {
  namaOrg: string
  tagline: string
  tahunBerdiri: number
  jumlahAnggota: number
  jumlahPenghargaan: number
  jumlahKegiatan: number
  alamat: string
  telepon: string
  email: string
  instagram: string
  instagramUrl: string
  youtube: string
  youtubeUrl: string
  facebook: string
  facebookUrl: string
}

export type SanityHomePage = {
  hero: {
    judul1: string
    judulHighlight: string
    judul2: string
    deskripsi: string
    ctaText: string
  }
  about: {
    judul1: string
    judulHighlight: string
    deskripsi1: string
    deskripsi2: string
    highlights: string[]
  }
  divisions: {
    heading: string
    subheading: string
  }
  featuredBidang?: SanityBidangCard[]
}

export type SanityVisiMisi = {
  visi: string
  misi: string[]
}

export type SanityFaq = {
  _id: string
  pertanyaan: string
  jawaban: string
}

export type EventStatus = "upcoming" | "ongoing" | "completed"

export type SanityActivity = {
  _id: string
  slug: string
  type: "event" | "article"
  title: string
  description: string
  imageUrl: string
  category: string
  date: string
  endDate?: string
  status?: EventStatus
  time?: string
  location?: string
  readTime?: string
  tags?: string[]
  agenda?: Array<{ time: string; item: string }>
  organizer?: string
  maxParticipants?: number
  author?: { name: string; role: string }
  body?: PortableTextBlock[]
}

export type SanityGalleryItem = {
  _id: string
  imageUrl: string
  alt: string
  caption: string
  category?: string
}

export type SanityDeptMember = {
  name: string
  role: string
  fakultas: string
  angkatan: string
}

export type SanityDeptDivisi = {
  name: string
  kepala: SanityDeptMember
  staff: SanityDeptMember[]
}

export type SanityDepartemenCard = {
  _id: string
  slug: string
  heading: string
  abbr: string
  imageUrl: string
  overlayTheme?: OverlayTheme
}

export type OverlayTheme = "green" | "maroon" | "neutral"

export type SanityProgramItem = {
  _key?: string
  title: string
  description: string
}

export type SanityDepartemenDetail = {
  _id: string
  slug: string
  heading: string
  abbr: string
  fullName: string
  imageUrl: string
  overlayTheme?: OverlayTheme
  description: string
  programItems: SanityProgramItem[]
  kepala: SanityDeptMember
  divisi: SanityDeptDivisi[]
}

export type SanityPrestasi = {
  _id: string
  title: string
  description: string
  year: number
  category: "Kompetisi" | "Penghargaan" | "Kolaborasi" | "Rekam Jejak"
  level: "Kampus" | "Kota" | "Provinsi" | "Nasional" | "Internasional"
  position?: string
  organizer: string
  location: string
  featured?: boolean
  order?: number
}

export type SanityBidangMember = {
  name: string
  role: string
  fakultas: string
  angkatan: string
}

export type SanityBidangGalleryItem = {
  imageUrl: string
  alt: string
  caption: string
}

export type SanityBidang = {
  _id: string
  slug: string
  heading: string
  abbr: string
  fullName: string
  imageUrl: string
  overlayTheme?: OverlayTheme
  description: string
  gallery: SanityBidangGalleryItem[]
  ketuaBidang: SanityBidangMember
  wakilKetuaBidang: SanityBidangMember
  order?: number
}

export type SanityBidangCard = Pick<
  SanityBidang,
  '_id' | 'slug' | 'heading' | 'abbr' | 'fullName' | 'imageUrl' | 'overlayTheme' | 'description' | 'order'
>


