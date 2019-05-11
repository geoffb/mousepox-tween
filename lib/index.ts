export * from "./Tween";
export * from "./TweenGroup";

export const Ease = {

  QuadIn(k: number): number {
    return k * k;
  },

  QuadOut(k: number): number {
    return k * (2 - k);
  },

  QuadInOut(k: number): number {
    k *= 2;
    if (k < 1) {
      return 0.5 * k * k;
    } else {
      return -0.5 * (--k * (k - 2) - 1);
    }
  },

};
