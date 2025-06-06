"use client";

import * as motion from "motion/react-client";
import { Polaroid } from "@/lib/types/polaroid";
import { getRotation } from "@/lib/utils/rotatePolaroid";
import { useIsMobile } from "@/hooks/useIsMobile";
import { PolaroidImage } from "./PolaroidImage";

interface PolaroidCardProps {
  polaroid: Polaroid;
  index: number;
}

export const PolaroidCard = ({ polaroid, index }: PolaroidCardProps) => {
  const isMobile = useIsMobile();

  return (
    <motion.div
      drag={!isMobile}
      dragMomentum={false}
      initial={{ rotate: getRotation(index) }}
      className="relative w-full aspect-[4/4] bg-[#fdfdfd] p-2 rounded-sm shadow-xs ring ring-neutral-800/10 dark:shadow-none select-none"
      style={{
        touchAction: isMobile ? "auto" : "none",
        cursor: isMobile ? "default" : "move",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <PolaroidImage src={polaroid.src} alt={polaroid.alt} index={index} />
      <p className="text-neutral-800 font-medium mt-1 py-2 text-center font-handwriting text-2xl">
        {polaroid.caption}
      </p>
    </motion.div>
  );
};
