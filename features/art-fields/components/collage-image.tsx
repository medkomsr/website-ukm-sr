import Image, { getImageProps, type ImageProps } from "next/image";

const variants = {
  thumbnail: {
    widths: [240, 320, 480, 640, 800, 960],
    fallback: 640,
    quality: 75,
    sizes: "auto, (max-width: 700px) 86vw, (max-width: 1372px) 50vw, 680px",
  },
  enlarged: {
    widths: [960, 1280, 1600, 2048],
    fallback: 1600,
    quality: 85,
    sizes: "(max-width: 1222px) 90vw, 1100px",
  },
};

type CollageImageProps = Pick<
  ImageProps,
  "alt" | "fill" | "width" | "height" | "sizes" | "style"
> & {
  src: string;
  cdnVariant?: keyof typeof variants;
};

export default function CollageImage({ cdnVariant, ...props }: CollageImageProps) {
  if (!cdnVariant) return <Image {...props} alt={props.alt} />;

  const { widths, fallback, quality, sizes } = variants[cdnVariant];
  const url = new URL(props.src);
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  url.searchParams.set("q", String(quality));
  function sizedUrl(width: number) {
    url.searchParams.set("w", String(width));
    return url.href;
  }

  const srcSet = widths.map((width) => `${sizedUrl(width)} ${width}w`).join(", ");
  const { props: img } = getImageProps({
    ...props,
    src: sizedUrl(fallback),
    unoptimized: true,
    loading: cdnVariant === "thumbnail" ? "lazy" : "eager",
  });

  // Sanity serves each width directly; keep Next's existing fill and aspect-ratio styles.
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...img} sizes={sizes} srcSet={srcSet} alt={props.alt} />;
}
