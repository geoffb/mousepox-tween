import { Tween } from "./Tween";

export class TweenGroup {

  private tweens: Tween[] = [];

  // Add a tween to this group
  public add(tween: Tween) {
    this.tweens.push(tween);
  }

  // Cancel all tween (or just for a specified target)
  public cancel(target?: any) {
    for (let i = this.tweens.length - 1; i >= 0; --i) {
      if (target === undefined || this.tweens[i].target === target) {
        this.tweens.splice(i, 1);
      }
    }
  }

  // Update all tweens in this group
  public update(dt: number) {
    const complete: number[] = [];

    // Update tweens
    for (let i = 0; i < this.tweens.length; ++i) {
      const tween = this.tweens[i];
      tween.update(dt);
      if (tween.complete) {
        complete.push(i);
      }
    }

    // Remove completed tweens
    for (const index of complete) {
      this.tweens.splice(index, 1);
    }
  }

}
