import { StateMachine } from 'javascript-state-machine';
import Target from './target';
import Tracker from './tracker';
import dataset from './dataset';
import * as IRub from './interface';

const BLOCK_SIZE = 3; // [t, x, y]
const TRACK_SIZE = 900000; // (bytes)

const isActive = (target: IRub.TargetInterface): boolean => target.isActive();

abstract class PointerHandler implements IRub.PointerHandlerInterface {
  protected state: IRub.PointerStateMachine;

  protected listener: IRub.ListenerInterface;

  protected targets: IRub.TargetInterface[];

  protected coords: IRub.TrackerInterface;

  protected attached = false;

  public constructor(els: HTMLDivElement[]) {
    this.targets = els.map((el) => {
      const target = new Target(el);
      target.state.initialize();
      return target;
    });

    this.state = StateMachine.create(
      dataset.pointer
    ) as IRub.PointerStateMachine;
    this.state.initialize();

    this.coords = new Tracker(TRACK_SIZE, BLOCK_SIZE);
    this.listener = {};
  }

  protected findTargetIndex(
    predicate: (target: IRub.TargetInterface) => boolean
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
