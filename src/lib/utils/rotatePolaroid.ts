export const ROTATION_RANGE = {
  min: -5,
  max: 5,
  multiplier: 7
} as const; 

export const getRotation = (id: number): number => {
  return ((id * ROTATION_RANGE.multiplier) % (ROTATION_RANGE.max - ROTATION_RANGE.min)) + ROTATION_RANGE.min
} 