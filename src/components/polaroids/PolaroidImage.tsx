import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  index: number;
}

export const PolaroidImage = ({ src, alt, index }: Props) => {
  return (
    <div className="relative w-full h-[100%] bg-[#fafafa]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover"
        draggable={false}
        priority={index < 4}
      />
    </div>
  );
};
