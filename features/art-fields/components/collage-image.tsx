import Image, { getImageProps, type ImageProps } from "next/image";

const variants = {
  thumbnail: {
    widths: [240, 320, 480, 640, 800, 960],
    fallback: 640,
    quality: 75,
    sizes: "auto, (max-width: 700px) 86vw, (max-width: 1372px) 50vw, 680px",
  },
  enlarged: {
    widths: [480, 640, 828, 1080, 1440, 1920, 2048],
    fallback: 1920,
    quality: 85,
    sizes: "(max-width: 1222px) 90vw, 1100px",
  },
  retry: {
    widths: [480, 640, 828, 960],
    fallback: 828,
    quality: 72,
    sizes: "(max-width: 1222px) 90vw, 1100px",
  },
};

type CollageImageProps = Pick<
  ImageProps,
  "alt" | "fill" | "style" | "className" | "onLoad" | "onError"
> & {
  src: string;
  variant: keyof typeof variants;
};

export default function CollageImage({ variant, onLoad, onError, ...props }: CollageImageProps) {
  const { widths, fallback, quality, sizes } = variants[variant];
  const loading = variant === "thumbnail" ? "lazy" : "eager";
  if (!props.src.startsWith("https://cdn.sanity.io/images/")) {
    return (
      <Image
        {...props}
        alt={props.alt}
        sizes={sizes}
        loading={loading}
        onLoad={onLoad}
        onError={onError}
      />
    );
  }

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
    loading,
  });

  // Sanity serves each width directly; keep Next's existing fill and aspect-ratio styles.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...img} sizes={sizes} srcSet={srcSet} alt={props.alt} onLoad={onLoad} onError={onError} />
  );
}
