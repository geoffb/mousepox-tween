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

  BackIn(k: number): number {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * k * k * k - c1 * k * k;
  },

  BackOut(k: number): number {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2);
  },

  BackInOut(k: number): number {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return k < 0.5
      ? (Math.pow(2 * k, 2) * ((c2 + 1) * 2 * k - c2)) / 2
      : (Math.pow(2 * k - 2, 2) * ((c2 + 1) * (k * 2 - 2) + c2) + 2) / 2;
  }

};
