import Image from "next/image";
import s from "./newsroom.module.css";

export default function StoryImage({ src, sizes, eager = false }: { src?: string; sizes: string; eager?: boolean }) {
  return <div className={s.storyImage}>
    {src ? <Image src={src} alt="" fill sizes={sizes} loading={eager ? "eager" : "lazy"} className={s.cover}/> : <div className={s.imageFallback} aria-hidden="true">SR.</div>}
  </div>;
}
