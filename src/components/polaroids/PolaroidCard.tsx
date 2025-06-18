"use client";

import * as motion from "motion/react-client";
import { Polaroid } from "@/lib/types/polaroid";
import { useIsMobile } from "@/hooks/useIsMobile";
import { PolaroidImage } from "./PolaroidImage";

interface PolaroidCardProps {
  polaroid: Polaroid;
  index: number;
}

export const PolaroidCard = ({ polaroid, index }: PolaroidCardProps) => {
  const isMobile = useIsMobile();

  const initialRotation = ((index * 7) % 10) - 5;

  return (
    <motion.div
      drag={!isMobile}
      dragMomentum={false}
      dragElastic={0.1}
      initial={{ rotate: initialRotation }}
      whileTap={
        !isMobile ? { rotate: 0, scale: 1.06, cursor: "grabbing" } : undefined
      }
      animate={{ rotate: initialRotation }}
      className="relative w-full aspect-[4/4] bg-[#fdfdfd] p-2 rounded-sm shadow-sm ring ring-neutral-800/10 dark:shadow-none select-none"
      style={{
        touchAction: isMobile ? "auto" : "none",
        cursor: isMobile ? "default" : "grab",
      }}
    >
      <PolaroidImage src={polaroid.src} alt={polaroid.alt} index={index} />
      <p className=" font-medium mt-1 py-2 text-center font-handwriting text-2xl text-neutral-800">
        {polaroid.caption}
      </p>
    </motion.div>
  );
};
