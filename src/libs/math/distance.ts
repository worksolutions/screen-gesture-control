import { V3 } from "../../types/math";

export const distance3D = (a: V3, b: V3) =>
  Math.sqrt(
    Math.pow(b[0] - a[0], 2) +
      Math.pow(b[1] - a[1], 2) +
      Math.pow(b[2] - a[2], 2)
  );
