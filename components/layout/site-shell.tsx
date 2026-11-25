import { cacheLife } from "next/cache";
import Footer from "@/components/layout/footer";
import SiteHeader from "@/components/layout/site-header";
import styles from "@/components/layout/site-shell.module.scss";

export function PublicHeader() {
  return (
    <>
      <a className={styles.skip} href="#main-content">
        Lewati ke konten
      </a>
      <SiteHeader />
    </>
  );
}

export async function PublicFooter({ wave = true }: { wave?: boolean }) {
  "use cache";
  cacheLife("days");
  return <Footer wave={wave} year={new Date().getFullYear()} />;
}
