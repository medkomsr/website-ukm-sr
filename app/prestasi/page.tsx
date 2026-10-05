import SiteLayout from "@/components/site-layout";
import AchievementExperience from "./components/achievement-experience";

export const metadata = {
  title: "Prestasi | UKM Seni Religi UB",
  description: "Rekam jejak prestasi dan penghargaan UKM Seni Religi Universitas Brawijaya dari tingkat kampus hingga nasional.",
};

export default function PrestasiPage() {
  return (
    <SiteLayout footerWave={false}>
      <AchievementExperience />
    </SiteLayout>
  );
}
