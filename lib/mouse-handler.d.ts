import PointerHandler from './pointer-handler';
import * as IRub from './interface';
export default class MouseHandler extends PointerHandler {
    constructor(els: HTMLDivElement[]);
    addListeners(el: HTMLDivElement): void;
    removeListeners(el: HTMLDivElement): void;
    static start(this: MouseHandler, state: IRub.PointerStateMachine, event: MouseEvent | TouchEvent): void;
    static move(this: MouseHandler, state: IRub.PointerStateMachine, event: MouseEvent | TouchEvent): void;
    static end(this: MouseHandler, state: IRub.PointerStateMachine, event: MouseEvent | TouchEvent): void;
    static activate(this: MouseHandler, event: MouseEvent | TouchEvent): void;
    static inactivate(this: MouseHandler, event: MouseEvent | TouchEvent): void;
}
//# sourceMappingURL=mouse-handler.d.ts.map