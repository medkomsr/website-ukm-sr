"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import SiteLayout from "@/components/layout/site-layout";
import { useBidangBySlug } from "@/hooks/content/use-bidang";
import { srFields } from "@/lib/constants/art-fields";
import type { SanityDepartemenDetail } from "@/sanity/types";
import { ProfileContent } from "@/features/departments/components/department-profile";
import s from "@/features/departments/components/department-profile.module.scss";
import DocumentationCollage from "@/features/art-fields/components/documentation-collage";

export default function BidangContent({ slug }: { slug: string }) {
  const { data, isPending, isError, refetch } = useBidangBySlug(slug);
  const field = srFields.find((item) => item.slug === slug);

  if (isPending)
    return (
      <SiteLayout>
        <div data-tone="cream" className={s.status} role="status">
          Menyiapkan cerita bidang…
        </div>
      </SiteLayout>
    );
  if (isError)
    return (
      <SiteLayout>
        <div data-tone="cream" className={s.status}>
          <h1>Halaman belum dapat dimuat.</h1>
          <button onClick={() => refetch()}>Coba lagi</button>
          <Link href="/tentang#field-team-title">Kembali ke pengurus bidang</Link>
        </div>
      </SiteLayout>
    );
  if (!data && !field) notFound();

  const profile: SanityDepartemenDetail = {
    _id: data?._id || `${slug}-preview`,
    slug,
    heading: data?.heading || "Bidang",
    abbr: data?.abbr || field?.name || data?.fullName || slug,
    fullName: data?.fullName || "",
    description: data?.description || field?.text || "",
    imageUrl: data?.imageUrl || "",
    overlay: data?.overlay || "",
    programs: [],
    programDescriptions: [],
    kepala: data?.ketuaBidang
      ? { ...data.ketuaBidang, role: data.ketuaBidang.role || "Ketua Bidang" }
      : { name: "", role: "", fakultas: "", angkatan: "" },
    divisi: data?.wakilKetuaBidang?.name
      ? [
          {
            name: "Pengurus Bidang",
            kepala: {
              ...data.wakilKetuaBidang,
              role: data.wakilKetuaBidang.role || "Wakil Ketua Bidang",
            },
            staff: [],
          },
        ]
      : [],
  };
  const description = data?.description || field?.description || profile.description;

  return (
    <SiteLayout footerWave={false}>
      <ProfileContent
        key={JSON.stringify(data || slug)}
        data={profile}
        fieldDescription={description}
      >
        <DocumentationCollage key={slug} name={profile.abbr} items={data?.gallery || []} />
      </ProfileContent>
    </SiteLayout>
  );
}
