import PointerHandler, { PointerStateMachine } from './pointer-handler';
import Target from './target';
import EventType from './event-type';

const { documentElement } = document;

export default class TouchHandler extends PointerHandler {
  public constructor(els: HTMLDivElement[]) {
    super(els);

    this.listener = {
      start: TouchHandler.start.bind(this, this.state),
      move: TouchHandler.move.bind(this, this.state),
      end: TouchHandler.end.bind(this, this.state),
      activate: TouchHandler.activate.bind(this),
      inactivate: TouchHandler.inactivate.bind(this),
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

  static start(
    this: TouchHandler,
    state: PointerStateMachine,
    event: MouseEvent | TouchEvent | PointerEvent
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
    this: TouchHandler,
    state: PointerStateMachine,
    event: MouseEvent | TouchEvent | PointerEvent
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
    this: TouchHandler,
    state: PointerStateMachine,
    event: MouseEvent | TouchEvent | PointerEvent
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

  static activate(
    this: TouchHandler,
    event: MouseEvent | TouchEvent | PointerEvent
  ): void {
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

  static inactivate(
    this: TouchHandler,
    event: MouseEvent | TouchEvent | PointerEvent
  ): void {
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
