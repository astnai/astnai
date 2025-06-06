import { PolaroidCard } from "./PolaroidCard";
import { Polaroid } from "@/lib/types/polaroid";

interface PolaroidGalleryProps {
  polaroids: Polaroid[];
}

export const PolaroidGallery = ({ polaroids }: PolaroidGalleryProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      {polaroids.map((polaroid) => (
        <PolaroidCard key={polaroid.id} polaroid={polaroid} />
      ))}
    </div>
  );
};
