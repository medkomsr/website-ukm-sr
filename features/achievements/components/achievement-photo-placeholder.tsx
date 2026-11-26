import Image from "next/image";

export function AchievementPhotoPlaceholder() {
  return (
    <Image
      src="/prestasi-placeholder.png"
      alt="Foto prestasi belum tersedia"
      fill
      unoptimized
      style={{ objectFit: "contain", backgroundColor: "#123d2a" }}
    />
  );
}
