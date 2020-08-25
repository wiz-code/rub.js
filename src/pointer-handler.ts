import { StateMachine } from 'javascript-state-machine';
import {
  PointerHandlerInterface,
  PointerStateMachine,
  ListenerInterface,
  TargetInterface,
  TrackerInterface,
} from './interface.ts';
import Target from './target.ts';
import Tracker from './tracker.ts';
import dataset from './dataset.ts';

const BLOCK_SIZE = 3; // [t, x, y]
const TRACK_SIZE = 900000; // (bytes)

const isActive = (target: TargetInterface): boolean => target.isActive();

abstract class PointerHandler implements PointerHandlerInterface {
  protected state: PointerStateMachine;

  protected listener: ListenerInterface;

  protected targets: TargetInterface[];

  protected coords: TrackerInterface;

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

  protected findTargetIndex(
    predicate: (target: TargetInterface) => boolean
  ): number {
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
