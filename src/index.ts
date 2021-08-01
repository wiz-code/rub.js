import StateMachine from 'javascript-state-machine';
import PointerHandler from './modules/pointer-handler';
import MouseHandler from './modules/mouse-handler';
import TouchHandler from './modules/touch-handler';
import Recorder from './modules/recorder';
import dataset from './modules/dataset';

type ZoneName = string;
type ZoneType = 'single' | 'multiple';
type Zone = {
  recorder: Recorder;
  event: PointerHandler;
};
type Region = Map<ZoneName, Zone>;
type LoopCallback = (frames: number) => void;

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

const MIN_INTERVAL = 4;
const REGION_ID = 'tracking-region';
const { abs, max } = Math;

function isTouchEnabled(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

function detectDevicePixelRatio(): number {
  return window.devicePixelRatio || 1;
}

function calcVelocity(dt: number, dx: number, dy: number): number {
  if (dt > 0) {
    const vx = abs(dx / dt);
    const vy = abs(dy / dt);

    return max(vx, vy);
  }
  return 0;
}

let id = 0;

function genId(): number {
  id += 1;
  return id;
}

export default class Rub {
  private id: number;

  private region: Region = new Map();

  private zoneName: ZoneName;

  private inputId = 0;

  private outputId = 0;

  private loopCallbacks: LoopCallback[] = [];

  private offset = 0;

  private t0 = 0;

  private x0 = 0;

  private y0 = 0;

  private multiplier = detectDevicePixelRatio();

  public media: MediaStateMachine;

  public constructor(
    private container: HTMLDivElement,
    callback?: LoopCallback | LoopCallback[]
  ) {
    this.id = genId();

    const regionContainer = this.container.querySelector(
      `.${REGION_ID}`
    ) as HTMLDivElement;
    const zones = Array.from(regionContainer.children) as HTMLDivElement[];

    for (let i = 0, l = zones.length; i < l; i += 1) {
      const zone = zones[i];
      const zoneName = zone.dataset.zoneName as ZoneName;
      const zoneType = zone.dataset.zoneType as ZoneType;

      if (zoneName == null) {
        throw new Error('cannot find identified zone name');
      }

      const targetEls =
        zoneType !== 'single' ? Array.from(zone.children) : [zone];

      const Handler = !isTouchEnabled() ? MouseHandler : TouchHandler;

      this.region.set(zoneName, {
        recorder: new Recorder(targetEls as HTMLDivElement[]),
        event: new Handler(targetEls as HTMLDivElement[]),
      });
    }

    const keys = this.region.keys();
    this.zoneName = keys.next().value;
    const zone = this.region.get(this.zoneName) as Zone;
    zone.event.addListeners(this.container);

    this.media = StateMachine.create(dataset.media) as MediaStateMachine;

    if (callback != null) {
      this.addLoopCallback(callback);
    }

    this.input = this.input.bind(this);
    this.output = this.output.bind(this);
  }

  private output(): void {
    const { recorder } = this.region.get(this.zoneName) as Zone;

    if (this.loopCallbacks.length > 0) {
      const frames = recorder.getFrames();

      for (let i = 0, l = this.loopCallbacks.length; i < l; i += 1) {
        this.loopCallbacks[i](frames);
      }
    }

    this.outputId = requestAnimationFrame(this.output);
  }

  private input(ctime: number): void {
    const { event, recorder } = this.region.get(this.zoneName) as Zone;
    let velocity = 0;
    let targetIndex = -1;

    if (event.isAttached()) {
      const count = event.getEventTrackCount();
      if (count > this.offset) {
        const track = event.getEventTrack();
        const [t, x, y] = Array.from(track);

        if (this.t0 > 0) {
          const dt = t - this.t0;
          const dx = x - this.x0;
          const dy = y - this.y0;

          if (dt > MIN_INTERVAL) {
            velocity = calcVelocity(dt, dx, dy);
            velocity *= this.multiplier;
          }
        }

        this.t0 = t;
        this.x0 = x;
        this.y0 = y;

        this.offset = count;
      }

      targetIndex = event.getActiveTargetIndex();
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
    const { recorder } = this.region.get(this.zoneName) as Zone;

    recorder.suspend();

    cancelAnimationFrame(this.inputId);
    cancelAnimationFrame(this.outputId);
  }

  /* レコーディングの状態を初期に戻す */
  public clearLoop(): void {
    this.t0 = 0;
    this.x0 = 0;
    this.y0 = 0;
    this.offset = 0;

    this.resetZone();
  }

  public getCurrentZoneName(): ZoneName {
    return this.zoneName;
  }

  public getRecorder(): Recorder {
    return (this.region.get(this.zoneName) as Zone).recorder;
  }

  public setZone(key: ZoneName): void {
    const zone = this.region.get(key);

    if (zone == null) {
      throw new Error('this is assigned undefined');
    }

    this.zoneName = key;

    this.resetZone();
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

  private setEventHandler(): void {
    const { event } = this.region.get(this.zoneName) as Zone;

    if (!event.isAttached()) {
      event.addListeners(this.container);
    }
  }

  private removeEventHandler(): void {
    const { event } = this.region.get(this.zoneName) as Zone;

    if (event.isAttached()) {
      event.removeListeners(this.container);
    }
  }

  private resetZone(): void {
    const { event, recorder } = this.region.get(this.zoneName) as Zone;

    event.clearEventTracks();
    recorder.resetFrames();
  }
}
