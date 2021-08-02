import StateMachine from 'javascript-state-machine';
import Target from './target';
import Tracker from './tracker';
import dataset from './dataset';

const BLOCK_SIZE = 3; // [t, x, y]
const TRACK_SIZE = 900000; // (bytes)

const isActive = (target: Target): boolean => target.isActive();

export interface PointerStateMachine extends StateMachine.StateMachine {
  initialize(): void;
  start(): void;
  end(): void;
}

interface ListenerInterface {
  [index: string]: (event: MouseEvent | TouchEvent | PointerEvent) => void;
}

abstract class PointerHandler {
  protected state: PointerStateMachine;

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

    this.state = StateMachine.create(dataset.pointer) as PointerStateMachine;
    this.state.initialize();

    this.coords = new Tracker(TRACK_SIZE, BLOCK_SIZE);
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
    return this.coords.getTrack();
  }

  public clearEventTracks(): void {
    return this.coords.clearTracks();
  }

  public isAttached(): boolean {
    return this.attached;
  }

  public abstract addListeners(el: HTMLDivElement): void;

  public abstract removeListeners(el: HTMLDivElement): void;
}

export default PointerHandler;
