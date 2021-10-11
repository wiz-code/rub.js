import StateMachine from 'javascript-state-machine';
import Target from './target';
import Tracker from './tracker';
import dataset from './dataset';
import EventType from './event-type';

const BLOCK_SIZE = 3; // [t, x, y]
const DURATION = 300; // (seconds)
const { documentElement } = document;

const isActive = (target: Target): boolean => target.isActive();

export interface PointerStateMachine extends StateMachine.StateMachine {
  initialize(): void;
  start(): void;
  end(): void;
}

interface ListenerInterface {
  [index: string]: (event: PointerEvent) => void;
}

class PointerHandler {
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

    const trackSize = DURATION * 60;
    this.coords = new Tracker(trackSize, BLOCK_SIZE);
    this.listener = {
      start: PointerHandler.start.bind(this, this.state),
      end: PointerHandler.end.bind(this, this.state),
      move: PointerHandler.move.bind(this, this.state),
      activate: PointerHandler.activate.bind(this),
      inactivate: PointerHandler.inactivate.bind(this),
    };
  }

  public addListeners(el: HTMLDivElement): void {
    if (this.listener == null) {
      return;
    }

    if (this.attached) {
      return;
    }

    this.attached = true;

    el.addEventListener(EventType.PointerDown, this.listener.start, false);
    el.addEventListener(EventType.PointerMove, this.listener.move, false);
    el.addEventListener(EventType.PointerUp, this.listener.end, false);
    el.addEventListener(EventType.PointerCancel, this.listener.end, false);

    for (let i = 0, l = this.targets.length; i < l; i += 1) {
      const target = this.targets[i];

      target.el.addEventListener(
        EventType.PointerEnter,
        this.listener.activate,
        false
      );
      target.el.addEventListener(
        EventType.PointerLeave,
        this.listener.inactivate,
        false
      );
    }
  }

  public removeListeners(el: HTMLDivElement): void {
    if (this.listener == null) {
      return;
    }

    if (!this.attached) {
      return;
    }

    this.attached = false;

    el.removeEventListener(EventType.PointerDown, this.listener.start, false);
    el.removeEventListener(EventType.PointerMove, this.listener.move, false);
    el.removeEventListener(EventType.PointerUp, this.listener.end, false);
    el.removeEventListener(EventType.PointerCancel, this.listener.end, false);

    for (let i = 0, l = this.targets.length; i < l; i += 1) {
      const target = this.targets[i];

      target.el.removeEventListener(
        EventType.PointerEnter,
        this.listener.activate,
        false
      );
      target.el.removeEventListener(
        EventType.PointerLeave,
        this.listener.inactivate,
        false
      );
    }
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

  static start(
    this: PointerHandler,
    state: PointerStateMachine,
    event: PointerEvent
  ): void {
    if (!(event instanceof PointerEvent)) {
      return;
    }

    if (state.current !== 'idling') {
      return;
    }

    state.start();

    const t = performance.now();

    const rect: DOMRect = documentElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.coords.addTrack([t, x, y]);
  }

  static move(
    this: PointerHandler,
    state: PointerStateMachine,
    event: PointerEvent
  ): void {
    if (!(event instanceof PointerEvent)) {
      return;
    }

    if (state.current !== 'running') {
      return;
    }

    const t = performance.now();

    const rect: DOMRect = documentElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.coords.addTrack([t, x, y]);
  }

  static end(
    this: PointerHandler,
    state: PointerStateMachine,
    event: PointerEvent
  ): void {
    if (!(event instanceof PointerEvent)) {
      return;
    }

    if (state.current !== 'running') {
      return;
    }

    const t = performance.now();

    const rect: DOMRect = documentElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.coords.addTrack([t, x, y]);

    state.end();
  }

  static activate(this: PointerHandler, event: PointerEvent): void {
    const index = this.findTargetIndex(
      (t: Target): boolean => t.el === (event.target as HTMLDivElement)
    );
    const target = this.targets[index];

    if (target == null) {
      return;
    }

    if (target.state.current !== 'inactive') {
      return;
    }

    target.state.activate();
  }

  static inactivate(this: PointerHandler, event: PointerEvent): void {
    const index = this.findTargetIndex(
      (t: Target): boolean => t.el === (event.target as HTMLDivElement)
    );
    const target = this.targets[index];

    if (target == null) {
      return;
    }

    if (target.state.current !== 'active') {
      return;
    }

    target.state.inactivate();
  }
}

export default PointerHandler;
