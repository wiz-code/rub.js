import * as JSM from 'javascript-state-machine';
import MouseHandler from './modules/mouse-handler';
import TouchHandler from './modules/touch-handler';
import Recorder from './modules/recorder';
import dataset from './modules/dataset';
import * as IRub from './modules/interface';

interface Loop {
  (ctime: number): void;
}

const MIN_INTERVAL = 4;
const BOUNDS_ID = 'rb-bounds';
const { abs, max } = Math;

function isTouchEnabled(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

function getVelocity(dt: number, dx: number, dy: number): number {
  if (dt > 0) {
    return max(abs(dx / dt), abs(dy / dt));
  }
  return 0;
}

let id = 0;

function genId(): number {
  id += 1;
  return id;
}

export default class Rub implements IRub.MainInterface {
  private id: number;

  private bounds: Map<IRub.BoundsType, IRub.Bounds> = new Map();

  private currentBoundsType: IRub.BoundsType;

  private inputId = 0;

  private outputId = 0;

  private loopCallbacks: IRub.LoopCallback[] = [];

  private input: Loop;

  private output: Loop;

  private offset = 0;

  private t0 = 0;

  private x0 = 0;

  private y0 = 0;

  public event: IRub.PointerHandlerInterface;

  public recorder: IRub.RecorderInterface;

  public media: IRub.MediaStateMachine;

  public constructor(
    private container: HTMLDivElement,
    callback?: IRub.LoopCallback | IRub.LoopCallback[]
  ) {
    this.id = genId();

    const boundsContainer = this.container.querySelector(
      `.${BOUNDS_ID}`
    ) as HTMLDivElement;
    const els = Array.from(boundsContainer.children) as HTMLDivElement[];

    for (let i = 0, l = els.length; i < l; i += 1) {
      const el = els[i];
      const identifier = el.dataset.boundsType as IRub.BoundsType;

      if (identifier == null) {
        throw new Error('cannot find identified class name');
      }

      const targetEls =
        el.childElementCount > 0 ? Array.from(el.children) : [el];

      const Handler = !isTouchEnabled() ? MouseHandler : TouchHandler;

      this.bounds.set(identifier, {
        recorder: new Recorder(targetEls as HTMLDivElement[]),
        event: new Handler(targetEls as HTMLDivElement[]),
      });
    }

    const [key] = Array.from(this.bounds.keys());
    const bounds = this.bounds.get(key) as IRub.Bounds;
    this.currentBoundsType = key;
    this.recorder = bounds.recorder;
    this.event = bounds.event;
    this.event.addListeners(this.container);

    this.media = JSM.create(dataset.media) as IRub.MediaStateMachine;

    if (callback != null) {
      this.addLoopCallback(callback);
    }

    this.output = (): void => {
      if (this.loopCallbacks.length > 0) {
        const frames = this.recorder.getFrames();

        for (let i = 0, l = this.loopCallbacks.length; i < l; i += 1) {
          this.loopCallbacks[i](frames);
        }
      }

      this.outputId = requestAnimationFrame(this.output);
    };

    this.input = (ctime: number): void => {
      let velocity = 0;
      let targetIndex = -1;

      if (this.event.isAttached()) {
        const count = this.event.getEventTrackCount();
        if (count > this.offset) {
          const track = this.event.getEventTrack();
          const [t, x, y] = Array.from(track);

          if (this.t0 > 0) {
            const dt = t - this.t0;
            const dx = x - this.x0;
            const dy = y - this.y0;

            if (dt > MIN_INTERVAL) {
              velocity = getVelocity(dt, dx, dy);
            }
          }

          this.t0 = t;
          this.x0 = x;
          this.y0 = y;

          this.offset = count;
        }

        targetIndex = this.event.getActiveTargetIndex();
      }

      this.recorder.update(ctime, velocity, targetIndex);

      this.inputId = requestAnimationFrame(this.input);
    };
  }

  public getId(): number {
    return this.id;
  }

  /* ポインターイベントの速度計測とその出力を開始または再開する。 */
  public startLoop(): void {
    this.inputId = requestAnimationFrame(this.input);
    this.outputId = requestAnimationFrame(this.output);
  }

  /* レコーディングを一時停止する。経過時間は停止した時点のまま */
  public stopLoop(): void {
    this.recorder.suspend();

    cancelAnimationFrame(this.inputId);
    cancelAnimationFrame(this.outputId);
  }

  /* レコーディングの状態を初期に戻す */
  public clearLoop(): void {
    this.t0 = 0;
    this.x0 = 0;
    this.y0 = 0;
    this.offset = 0;

    this.resetBoundsType();
  }

  public getCurrentBoundsType(): IRub.BoundsType {
    return this.currentBoundsType;
  }

  public setBoundsType(key: IRub.BoundsType): void {
    const bounds = this.bounds.get(key);

    if (bounds == null) {
      throw new Error('this is assigned undefined');
    }

    this.currentBoundsType = key;

    this.resetBoundsType();
    this.removeEventHandler();

    this.recorder = bounds.recorder;
    this.event = bounds.event;
    this.setEventHandler();
  }

  public setMediaCallback(callback: IRub.MediaStateCallback): void {
    Object.assign(this.media, callback);
  }

  public addLoopCallback(
    callback: IRub.LoopCallback | IRub.LoopCallback[]
  ): void {
    if (!Array.isArray(callback)) {
      this.loopCallbacks.push(callback.bind(this));
    } else {
      for (let i = 0, l = callback.length; i < l; i += 1) {
        this.loopCallbacks.push(callback[i].bind(this));
      }
    }
  }

  public clearLoopCallback(): void {
    this.loopCallbacks.length = 0;
  }

  private setEventHandler(): void {
    if (!this.event.isAttached()) {
      this.event.addListeners(this.container);
    }
  }

  private removeEventHandler(): void {
    if (this.event.isAttached()) {
      this.event.removeListeners(this.container);
    }
  }

  private resetBoundsType(): void {
    this.event.clearEventTracks();
    this.recorder.resetFrames();
  }
}
