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
        // Defer removal of tweens until next update cycle
        this.tweens[i].cancel = true;
      }
    }
  }

  public create(target: any): Tween {
    const tween = new Tween(target);
    this.tweens.push(tween);
    return tween;
  }

  // Update all tweens in this group
  public update(dt: number) {
    const complete: number[] = [];

    // Update tweens
    for (let i = 0; i < this.tweens.length; ++i) {
      const tween = this.tweens[i];
      if (tween.cancel) {
        complete.push(i);
        continue;
      }
      tween.update(dt);
      if (tween.complete) {
        complete.push(i);
      }
    }

    // Remove completed tweens
    // Loop backwards in order to splice higher indices before lower indices
    for (let i = complete.length - 1; i >= 0; --i) {
      this.tweens.splice(complete[i], 1);
    }
  }

}
