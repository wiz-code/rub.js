import PointerHandler, { PointerStateMachine } from './pointer-handler';
import EventType from './event-type';

const { documentElement } = document;

export default class TouchHandler extends PointerHandler {
  public constructor(els: HTMLDivElement[]) {
    super(els);

    this.listener = {
      start: TouchHandler.start.bind(this, this.state),
      move: TouchHandler.move.bind(this, this.state),
      end: TouchHandler.end.bind(this, this.state),
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
    const eventOptions: AddEventListenerOptions = {
      passive: true,
    };

    el.addEventListener(
      EventType.TouchStart,
      this.listener.start,
      eventOptions
    );
    el.addEventListener(EventType.TouchMove, this.listener.move, eventOptions);
    el.addEventListener(EventType.TouchEnd, this.listener.end, false);
    el.addEventListener(EventType.TouchCancel, this.listener.end, false);
  }

  public removeListeners(el: HTMLDivElement): void {
    if (this.listener == null) {
      return;
    }

    if (!this.attached) {
      return;
    }
    this.attached = false;

    el.removeEventListener(EventType.TouchStart, this.listener.start, false);
    el.removeEventListener(EventType.TouchMove, this.listener.move, false);
    el.removeEventListener(EventType.TouchEnd, this.listener.end, false);
    el.removeEventListener(EventType.TouchCancel, this.listener.end, false);
  }

  static start(
    this: TouchHandler,
    state: PointerStateMachine,
    event: MouseEvent | TouchEvent
  ): void {
    if (!(event instanceof TouchEvent)) {
      return;
    }

    if (state.current !== 'idling') {
      return;
    }

    state.start();

    const t = performance.now();

    const rect: DOMRect = documentElement.getBoundingClientRect();
    const touch: Touch = Array.from(event.changedTouches)[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    this.coords.addTrack([t, x, y]);
  }

  static move(
    this: TouchHandler,
    state: PointerStateMachine,
    event: MouseEvent | TouchEvent
  ): void {
    if (!(event instanceof TouchEvent)) {
      return;
    }

    if (state.current !== 'running') {
      return;
    }

    const t = performance.now();

    const rect: DOMRect = documentElement.getBoundingClientRect();
    const touch: Touch = Array.from(event.changedTouches)[0];
    const cx = touch.clientX;
    const cy = touch.clientY;
    const x = cx - rect.left;
    const y = cy - rect.top;

    for (let i = 0, l = this.targets.length; i < l; i += 1) {
      const target = this.targets[i];
      const trect: DOMRect = target.el.getBoundingClientRect();

      const isActive =
        cx >= trect.left &&
        cx <= trect.left + trect.width &&
        cy >= trect.top &&
        cy <= trect.top + trect.height;

      if (isActive) {
        if (target.state.current !== 'active') {
          target.state.activate();
        }
      } else if (target.state.current !== 'inactive') {
        target.state.inactivate();
      }
    }

    this.coords.addTrack([t, x, y]);
  }

  static end(
    this: TouchHandler,
    state: PointerStateMachine,
    event: MouseEvent | TouchEvent
  ): void {
    if (!(event instanceof TouchEvent)) {
      return;
    }

    if (state.current !== 'running') {
      return;
    }

    const t = performance.now();

    const rect: DOMRect = documentElement.getBoundingClientRect();
    const touch: Touch = Array.from(event.changedTouches)[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    this.coords.addTrack([t, x, y]);

    state.end();
  }
}
