import SiteHeader from "./site-header";
import styles from "./elegant-shell.module.css";

export function ElegantHeader() {
  return (
    <>
      <a className={styles.skip} href="#main-content">Lewati ke konten</a>
      <SiteHeader />
    </>
  );
}

export { default as ElegantFooter } from "./footer";
