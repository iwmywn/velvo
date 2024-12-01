import Image from "next/image";
import { twMerge } from "tailwind-merge";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export default function ImageTag({ src, alt, className }: ImageProps) {
  return (
    <span
      className={twMerge(
        "relative h-20 w-20 flex-shrink-0 sm:h-24 sm:w-24",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 80px, 96px"
        style={{ objectFit: "contain" }}
      />
    </span>
  );
}
