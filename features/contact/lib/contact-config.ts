export const CONTACT_SUBJECTS = [
  {
    name: "Kerja sama",
    hint: "Ceritakan ide kolaborasi, bentuk kerja sama, dan waktu pelaksanaannya.",
  },
  {
    name: "Media partner",
    hint: "Ceritakan acara Anda, tanggal pelaksanaan, serta bentuk publikasi yang dibutuhkan.",
  },
  {
    name: "Undangan tampil",
    hint: "Ceritakan konsep acara, lokasi, tanggal, dan bidang Seni Religi yang ingin diundang.",
  },
  {
    name: "Pertanyaan umum",
    hint: "Apa yang ingin Anda ketahui tentang Seni Religi? Kami siap mendengarkan.",
  },
];

export const CONTACT_LIMITS = {
  bodyBytes: 32 * 1024,
  name: 100,
  email: 200,
  organization: 160,
  message: 4000,
} as const;
export const CONTACT_EMAIL_PATTERN = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
