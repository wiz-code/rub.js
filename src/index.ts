import StateMachine from 'javascript-state-machine';
import PointerHandler from './modules/pointer-handler';
import TouchHandler from './modules/touch-handler';
import Recorder from './modules/recorder';
import dataset from './modules/dataset';

type TrackingZone = string;
type ZoneType = 'single' | 'multiple';
type Zone = {
  recorder: Recorder;
  event: PointerHandler | TouchHandler;
};
type Area = Map<TrackingZone, Zone>;
type LoopCallback = (frames: number) => void;
type Pointer = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

interface MediaStateMachine extends StateMachine.StateMachine {
  initialize(): void;

  ready(): void;

  reset(): void;

  start(): void;

  stop(): void;

  pause(): void;

  resume(): void;

  quit(): void;

  abort(): void;
}

interface MediaStateCallback {
  oninitialize(): void;
  onready(): void;
  onreset(): void;
  onstart(): void;
  onstop(): void;
  onpause(): void;
  onresume(): void;
  onquit(): void;
  onabort(): void;

  oninitialized(): void;
  onrunning(): void;
  onpending(): void;
  onidling(): void;
  onerror(): void;
}

const FPS = 60;
const MIN_INTERVAL = 4;
const AREA_ID = 'tracking-area';
const { abs, max, floor } = Math;

function isTouchDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

/* function calcVelocity(dt: number, dx: number, dy: number): number {
  if (dt > 0) {
    const vx = abs(dx / dt);
    const vy = abs(dy / dt);

    return max(vx, vy);
  }
  return 0;
} */

let id = 0;

function genId(): number {
  id += 1;
  return id;
}

export default class Rub {
  private id: number;

  private area: Area = new Map();

  private trackingZone: TrackingZone;

  private inputId = 0;

  private outputId = 0;

  private loopCallbacks: LoopCallback[] = [];

  private offsetCount = 0;

  private t0 = 0;

  private x0 = 0;

  private y0 = 0;

  private framerate = 0;

  private basetime = performance.now();

  private frameCount = 0;

  private multiplier = 1;

  private adjustVelocity = false;

  private x = 0;

  private y = 0;

  private vx = 0;

  private vy = 0;

  public media: MediaStateMachine;

  public constructor(
    private container: HTMLDivElement,
    callback?: LoopCallback | LoopCallback[]
  ) {
    this.id = genId();
    const Handler = isTouchDevice() ? TouchHandler : PointerHandler;
    /* const areaContainer = this.container.querySelector(
      `.${AREA_ID}`
    ) as HTMLDivElement; */
    // const zones = Array.from(areaContainer.children) as HTMLDivElement[];
    const zones = Array.from(
      this.container.querySelectorAll(
        `.${AREA_ID} > div[data-zone-type]`
      ) as NodeListOf<HTMLDivElement>
    ) as HTMLDivElement[];

    for (let i = 0, l = zones.length; i < l; i += 1) {
      const zone = zones[i];
      const trackingZone = zone.dataset.trackingZone as TrackingZone;
      const zoneType = zone.dataset.zoneType as ZoneType;

      if (trackingZone == null) {
        throw new Error('cannot find identified tracking zone id');
      }

      const targetEls =
        zoneType !== 'single' ? Array.from(zone.children) : [zone];

      this.area.set(trackingZone, {
        recorder: new Recorder(targetEls as HTMLDivElement[]),
        event: new Handler(targetEls as HTMLDivElement[]),
      });
    }

    const keys = this.area.keys();
    this.trackingZone = keys.next().value;
    const zone = this.area.get(this.trackingZone) as Zone;
    zone.event.addListeners(this.container);

    this.media = StateMachine.create(dataset.media) as MediaStateMachine;

    if (callback != null) {
      this.addLoopCallback(callback);
    }

    this.input = this.input.bind(this);
    this.output = this.output.bind(this);
  }

  private output(): void {
    const { recorder } = this.area.get(this.trackingZone) as Zone;

    if (this.loopCallbacks.length > 0) {
      const frames = recorder.getFrames();

      for (let i = 0, l = this.loopCallbacks.length; i < l; i += 1) {
        this.loopCallbacks[i](frames);
      }
    }

    this.outputId = requestAnimationFrame(this.output);
  }

  private input(ctime: number): void {
    this.frameCount += 1;
    const diff = ctime - this.basetime;

    if (diff >= 1000) {
      this.framerate = floor((this.frameCount * 1000) / diff);
      this.basetime = ctime;
      this.frameCount = 0;

      if (this.adjustVelocity && this.framerate > 0) {
        const multiplier = FPS / this.framerate;
        this.setMultiplier(multiplier);
      }
    }

    const { event, recorder } = this.area.get(this.trackingZone) as Zone;
    let velocity = 0;
    let targetIndex = -1;

    if (event.isAttached()) {
      const count = event.getEventTrackCount();

      if (count > 0) {
        const track = event.getEventTrack();
        const [t, x, y] = Array.from(track);

        this.x = x;
        this.y = y;

        this.vx = 0;
        this.vy = 0;

        if (count > this.offsetCount) {
          if (this.offsetCount === 0) {
            this.t0 = t;
            this.x0 = x;
            this.y0 = y;
            this.offsetCount = count;
          } else {
            const dt = t - this.t0;
            const dx = x - this.x0;
            const dy = y - this.y0;

            if (dt > MIN_INTERVAL) {
              this.vx = dx / dt;
              this.vy = dy / dt;

              velocity = max(abs(this.vx), abs(this.vy));
              velocity *= this.multiplier;

              this.t0 = t;
              this.x0 = x;
              this.y0 = y;
              this.offsetCount = count;

              targetIndex = event.getActiveTargetIndex();
            }
          }
        } else if (count < this.offsetCount) {
          this.t0 = t;
          this.x0 = x;
          this.y0 = y;
          this.offsetCount = count;
        }
      }
    }

    recorder.update(ctime, velocity, targetIndex);

    this.inputId = requestAnimationFrame(this.input);
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
    const { recorder } = this.area.get(this.trackingZone) as Zone;

    recorder.suspend();

    cancelAnimationFrame(this.inputId);
    cancelAnimationFrame(this.outputId);
  }

  /* レコーディングの状態を初期に戻す */
  public clearLoop(): void {
    this.t0 = 0;
    this.x0 = 0;
    this.y0 = 0;
    this.offsetCount = 0;

    this.resetTrackingZone();
  }

  public getFramerate(): number {
    return this.framerate;
  }

  public getPointer(): Pointer {
    const pointer = {
      x: this.x,
      y: this.y,
      vx: this.vx,
      vy: this.vy,
    };

    return pointer;
  }

  public getTrackingZone(): TrackingZone {
    return this.trackingZone;
  }

  public getRecorder(): Recorder {
    return (this.area.get(this.trackingZone) as Zone).recorder;
  }

  public setTrackingZone(key: TrackingZone): void {
    const zone = this.area.get(key);

    if (zone == null) {
      throw new Error('this is assigned undefined');
    }

    this.trackingZone = key;

    this.resetTrackingZone();
    this.removeEventHandler();

    this.setEventHandler();
  }

  public setMediaCallback(callback: MediaStateCallback): void {
    Object.assign(this.media, callback);
  }

  public addLoopCallback(callback: LoopCallback | LoopCallback[]): void {
    const callbacks = Array.isArray(callback) ? callback : [callback];

    for (let i = 0, l = callbacks.length; i < l; i += 1) {
      this.loopCallbacks.push(callbacks[i].bind(this));
    }
  }

  public clearLoopCallbacks(): void {
    this.loopCallbacks.length = 0;
  }

  public destroy(): void {
    this.stopLoop();
    this.removeEventHandler();
    this.clearLoopCallbacks();

    this.area.forEach((zone) => {
      zone.event.destroy();
      zone.recorder.destroy();
    });
  }

  public setDuration(duration: number): void {
    this.area.forEach((zone) => {
      zone.recorder.resizeRecord(duration);
    });
    /* const { recorder } = this.area.get(this.trackingZone) as Zone;
    recorder.resizeRecord(duration); */
  }

  public isVelocityAdjusting(): boolean {
    return this.adjustVelocity;
  }

  public enableAdjustVelocity(bool = true): void {
    this.adjustVelocity = bool;
  }

  public getMultiplier(): number {
    return this.multiplier;
  }

  public setMultiplier(multiplier: number): void {
    this.multiplier = multiplier;
  }

  private setEventHandler(): void {
    const { event } = this.area.get(this.trackingZone) as Zone;

    if (!event.isAttached()) {
      event.addListeners(this.container);
    }
  }

  private removeEventHandler(): void {
    const { event } = this.area.get(this.trackingZone) as Zone;

    if (event.isAttached()) {
      event.removeListeners(this.container);
    }
  }

  private resetTrackingZone(): void {
    const { event, recorder } = this.area.get(this.trackingZone) as Zone;

    event.clearEventTracks();
    recorder.resetFrames();
  }
}
