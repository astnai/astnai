import { ROTATION_RANGE } from "@/lib/constants/polaroid"

export const getRotation = (id: number): number => {
  return ((id * ROTATION_RANGE.multiplier) % (ROTATION_RANGE.max - ROTATION_RANGE.min)) + ROTATION_RANGE.min
} 