import { V3 } from "../../types/math";

import { distance3D } from "../../math/distance";

export enum Gesture {
  POINT = "point",
}

interface HandInterface {
  thumb: [V3, V3, V3, V3];
  indexFinger: [V3, V3, V3, V3];
  middleFinger: [V3, V3, V3, V3];
  ringFinger: [V3, V3, V3, V3];
  pinky: [V3, V3, V3, V3];
  palmBase: [V3, V3, V3, V3];
}

function isPoint(hand: HandInterface): boolean {
  const lengthIndex = distance3D(hand.palmBase[0], hand.indexFinger[3]);
  const lengthMiddle = distance3D(hand.palmBase[0], hand.middleFinger[3]);
  return lengthIndex / lengthMiddle > 1.5;
}

export function understandGesture(hand: HandInterface): Gesture | null {
  if (isPoint(hand)) {
    return Gesture.POINT;
  }
  return null;
}
