import { ROTATION_RANGE } from "./constants"

export const getRotation = (id: number): number => {
  return ((id * ROTATION_RANGE.multiplier) % (ROTATION_RANGE.max - ROTATION_RANGE.min)) + ROTATION_RANGE.min
} 