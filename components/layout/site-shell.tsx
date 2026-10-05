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

export { default as PublicFooter } from "@/components/layout/footer";
