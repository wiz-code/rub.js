import PointerHandler from './pointer-handler.ts';
import { TargetInterface, PointerStateMachine } from './interface.ts';
import EventType from './event-type.ts';

const { documentElement } = document;

function start(
  this: MouseHandler,
  state: PointerStateMachine,
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

function move(
  this: MouseHandler,
  state: PointerStateMachine,
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

function end(
  this: MouseHandler,
  state: PointerStateMachine,
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

function activate(this: MouseHandler, event: MouseEvent | TouchEvent): void {
  const index = this.findTargetIndex(
    (t: TargetInterface): boolean => t.el === (event.target as HTMLDivElement)
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

function inactivate(this: MouseHandler, event: MouseEvent | TouchEvent): void {
  const index = this.findTargetIndex(
    (t: TargetInterface): boolean => t.el === (event.target as HTMLDivElement)
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

export default class MouseHandler extends PointerHandler {
  public constructor(els: HTMLDivElement[]) {
    super(els);

    this.listener = {
      start: start.bind(this, this.state),
      end: end.bind(this, this.state),
      move: move.bind(this, this.state),
      activate: activate.bind(this),
      inactivate: inactivate.bind(this),
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
}
