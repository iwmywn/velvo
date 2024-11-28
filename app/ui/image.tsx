import Image from "next/image";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  name: string;
}

export default function ImageTag({ src, name, className }: ImageProps) {
  return (
    <span
      className={`relative h-20 w-20 flex-shrink-0 sm:h-24 sm:w-24 ${className}`}
    >
      <Image
        src={src}
        alt={name}
        fill
        priority
        style={{ objectFit: "contain" }}
      />
    </span>
  );
}
