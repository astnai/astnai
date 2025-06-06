"use client";

import * as motion from "motion/react-client";
import { Polaroid } from "@/lib/types/polaroid";
import { getRotation } from "@/lib/utils/polaroid";
import { useIsMobile } from "@/hooks/useIsMobile";
import { PolaroidImage } from "./PolaroidImage";

interface PolaroidCardProps {
  polaroid: Polaroid;
}

export const PolaroidCard = ({ polaroid }: PolaroidCardProps) => {
  const isMobile = useIsMobile();

  return (
    <motion.div
      drag={!isMobile}
      dragMomentum={false}
      initial={{ rotate: getRotation(polaroid.id) }}
      className="relative w-full aspect-[4/4] bg-[#fdfdfd] p-2 shadow-xs ring ring-neutral-800/10 dark:ring-neutral-200/10 dark:shadow-white/10 select-none"
      style={{
        touchAction: isMobile ? "auto" : "none",
        cursor: isMobile ? "default" : "move",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <PolaroidImage src={polaroid.src} alt={polaroid.alt} />
      <p className="text-neutral-800 mt-1 py-2 text-center font-handwriting text-2xl">
        {polaroid.caption}
      </p>
    </motion.div>
  );
};
