export * from "./Tween";
export * from "./TweenGroup";

export const ease = {

  quadIn(k: number): number {
    return k * k;
  },

  quadOut(k: number): number {
    return k * (2 - k);
  },

  quadInOut(k: number): number {
    k *= 2;
    if (k < 1) {
      return 0.5 * k * k;
    } else {
      return -0.5 * (--k * (k - 2) - 1);
    }
  },

};
