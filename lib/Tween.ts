export type TweenCallback = () => void;

export type EasingFunction = (k: number) => number;

export interface ITweenProperties {
  [index: string]: number;
}

const enum TweenType {
  Call,
  To,
  Wait,
  Loop,
}

interface ITweenCall {
  type: TweenType.Call;
  callback: TweenCallback;
}

interface ITweenTo {
  duration: number;
  easing?: EasingFunction;
  elapsed: number;
  from: ITweenProperties;
  to: ITweenProperties;
  type: TweenType.To;
}

interface ITweenWait {
  type: TweenType.Wait;
  duration: number;
  elapsed: number;
}

interface ITweenLoop {
  type: TweenType.Loop;
  count: number;
}

type TweenQueueItem = ITweenCall | ITweenTo | ITweenWait | ITweenLoop;

function lerp(a: number, b: number, t: number): number {
  return a + ((b - a) * t);
}

export class Tween {

  public target: any;

  private queue: TweenQueueItem[] = [];

  private queueIndex = 0;

  public cancel = false;

  public get complete(): boolean {
    return this.queueIndex >= this.queue.length;
  }

  constructor(target: any) {
    this.target = target;
  }

  public call(callback: TweenCallback): Tween {
    this.queue.push({
      callback,
      type: TweenType.Call,
    });
    return this;
  }

  public to(props: ITweenProperties, duration: number, easing?: EasingFunction): Tween {
    this.queue.push({
      duration,
      easing,
      elapsed: 0,
      from: {},
      to: props,
      type: TweenType.To,
    });
    return this;
  }

  public update(dt: number) {
    while (dt > 0 && this.queueIndex < this.queue.length) {
      let used = 0;
      const item = this.queue[this.queueIndex];
      switch (item.type) {
        case TweenType.Call:
          used = this.processCall(item);
          break;
        case TweenType.To:
          used = this.processTo(item, dt);
          break;
        case TweenType.Wait:
          used = this.processWait(item, dt);
          break;
        case TweenType.Loop:
          this.processLoop(item);
          break;
      }
      dt -= used;
    }
  }

  public wait(duration: number): Tween {
    this.queue.push({
      duration,
      elapsed: 0,
      type: TweenType.Wait,
    });
    return this;
  }

  public loop(count = Infinity): Tween {
    this.queue.push({
      count,
      type: TweenType.Loop,
    });
    return this;
  }

  public promise(): Promise<void> {
    return new Promise((resolve) => this.call(resolve));
  }

  private processCall(tween: ITweenCall): number {
    tween.callback();
    this.queueIndex++;
    return 0;
  }

  private processTo(tween: ITweenTo, dt: number): number {
    // Set from properties the first time this tween is processed
    if (tween.elapsed === 0) {
      for (const key in tween.to) {
        if (!tween.to.hasOwnProperty(key)) { continue; }
        tween.from[key] = this.target[key];
      }
    }

    // Calcuate used time
    const used = Math.min(tween.duration - tween.elapsed, dt);
    tween.elapsed += used;

    let t = Math.min(tween.elapsed / tween.duration, 1);

    // Apply easing
    if (tween.easing) {
      t = tween.easing(t);
    }

    // Apply tweens
    for (const key in tween.to) {
      if (!tween.to.hasOwnProperty(key)) { continue; }
      this.target[key] = lerp(tween.from[key], tween.to[key], t);
    }

    if (tween.elapsed >= tween.duration) {
      tween.elapsed = 0;
      this.queueIndex++;
    }

    return used;
  }

  private processWait(tween: ITweenWait, dt: number): number {
    const used = Math.min(tween.duration - tween.elapsed, dt);
    tween.elapsed += used;
    if (tween.elapsed >= tween.duration) {
      tween.elapsed = 0;
      this.queueIndex++;
    }
    return used;
  }

  private processLoop(tween: ITweenLoop) {
    if (tween.count > 0) {
      // Keep looping
      tween.count--;
      this.queueIndex = 0;
    } else {
      // Stop looping
      this.queueIndex++;
    }
  }

}
