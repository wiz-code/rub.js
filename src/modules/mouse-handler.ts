import PointerHandler from './pointer-handler';
import EventType from './event-type';
import * as IRub from './interface';

const { documentElement } = document;

export default class MouseHandler extends PointerHandler {
  public constructor(els: HTMLDivElement[]) {
    super(els);

    this.listener = {
      start: MouseHandler.start.bind(this, this.state),
      end: MouseHandler.end.bind(this, this.state),
      move: MouseHandler.move.bind(this, this.state),
      activate: MouseHandler.activate.bind(this),
      inactivate: MouseHandler.inactivate.bind(this),
    };
  }

  public addListeners(el: HTMLDivElement): void {
    if (this.listener == null) {
      return;
    }

    this.attached = true;

    el.addEventListener(EventType.MouseDown, this.listener.start, false);
    el.addEventListener(EventType.MouseMove, this.listener.move, false);
    el.addEventListener(EventType.MouseUp, this.listener.end, false);

    for (let i = 0, l = this.targets.length; i < l; i += 1) {
      const target = this.targets[i];

      target.el.addEventListener(
        EventType.MouseEnter,
        this.listener.activate,
        false
      );
      target.el.addEventListener(
        EventType.MouseLeave,
        this.listener.inactivate,
        false
      );
    }
  }

  public removeListeners(el: HTMLDivElement): void {
    if (this.listener == null) {
      return;
    }

    this.attached = false;

    el.removeEventListener(EventType.MouseDown, this.listener.start, false);
    el.removeEventListener(EventType.MouseMove, this.listener.move, false);
    el.removeEventListener(EventType.MouseUp, this.listener.end, false);

    for (let i = 0, l = this.targets.length; i < l; i += 1) {
      const target = this.targets[i];

      target.el.removeEventListener(
        EventType.MouseEnter,
        this.listener.activate,
        false
      );
      target.el.removeEventListener(
        EventType.MouseLeave,
        this.listener.inactivate,
        false
      );
    }
  }

  static start(
    this: MouseHandler,
    state: IRub.PointerStateMachine,
    event: MouseEvent | TouchEvent
  ): void {
    if (!(event instanceof MouseEvent)) {
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
    this: MouseHandler,
    state: IRub.PointerStateMachine,
    event: MouseEvent | TouchEvent
  ): void {
    if (!(event instanceof MouseEvent)) {
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
    this: MouseHandler,
    state: IRub.PointerStateMachine,
    event: MouseEvent | TouchEvent
  ): void {
    if (!(event instanceof MouseEvent)) {
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

  static activate(this: MouseHandler, event: MouseEvent | TouchEvent): void {
    const index = this.findTargetIndex(
      (t: IRub.TargetInterface): boolean =>
        t.el === (event.target as HTMLDivElement)
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

  static inactivate(this: MouseHandler, event: MouseEvent | TouchEvent): void {
    const index = this.findTargetIndex(
      (t: IRub.TargetInterface): boolean =>
        t.el === (event.target as HTMLDivElement)
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
