import StateMachine from 'javascript-state-machine';
import Target from './target';
import Tracker from './tracker';
import dataset from './dataset';

const FPS = 60;
const BLOCK_SIZE = 3; // [t, x, y]
const DURATION = 300; // (seconds)

const isActive = (target: Target): boolean => target.isActive();

export interface EventStateMachine extends StateMachine.StateMachine {
  initialize(): void;
  start(): void;
  end(): void;
}

interface ListenerInterface {
  [index: string]: (event: MouseEvent | TouchEvent | PointerEvent) => void;
}

abstract class EventHandler {
  protected state: EventStateMachine;

  protected listener: ListenerInterface;

  protected targets: Target[];

  protected coords: Tracker;

  protected attached = false;

  public constructor(els: HTMLDivElement[]) {
    this.targets = els.map((el) => {
      const target = new Target(el);
      target.state.initialize();
      return target;
    });

    this.state = StateMachine.create(dataset.pointer) as EventStateMachine;
    this.state.initialize();

    const trackSize = DURATION * FPS;
    this.coords = new Tracker(trackSize, BLOCK_SIZE);
    this.listener = {};
  }

  protected findTargetIndex(predicate: (target: Target) => boolean): number {
    let result = -1;

    for (let i = 0, l = this.targets.length; i < l; i += 1) {
      const t = this.targets[i];

      if (predicate(t)) {
        result = i;
        break;
      }
    }

    return result;
  }

  public getActiveTargetIndex(): number {
    const targetIndex = this.findTargetIndex(isActive);

    return targetIndex;
  }

  public getEventTrackCount(): number {
    return this.coords.count;
  }

  public getEventTrack(): Float32Array {
    return this.coords.getLastTrack();
  }

  public clearEventTracks(): void {
    return this.coords.clearTracks();
  }

  public destroy(): void {
    this.coords = new Tracker(0, 0);
  }

  public resizeTracker(duration: number): void {
    const trackSize = duration * 60;
    this.coords = new Tracker(trackSize, BLOCK_SIZE);
  }

  public isAttached(): boolean {
    return this.attached;
  }

  public abstract addListeners(el: HTMLDivElement): void;

  public abstract removeListeners(el: HTMLDivElement): void;
}

export default EventHandler;
