import Image from "next/image";
import { twMerge } from "tailwind-merge";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export default function ImageTag({ src, alt, className }: ImageProps) {
  return (
    <span className={twMerge("flex h-20 justify-center", className)}>
      <Image
        src={src}
        alt={alt}
        width={80}
        height={80}
        loading="eager"
        sizes="(max-width: 640px) 33vw, 80px"
        style={{ objectFit: "contain" }}
      />
    </span>
  );
}
