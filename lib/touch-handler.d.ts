import PointerHandler from './pointer-handler';
import * as IRub from './interface';
export default class TouchHandler extends PointerHandler {
    constructor(els: HTMLDivElement[]);
    addListeners(el: HTMLDivElement): void;
    removeListeners(el: HTMLDivElement): void;
    static start(this: TouchHandler, state: IRub.PointerStateMachine, event: MouseEvent | TouchEvent): void;
    static move(this: TouchHandler, state: IRub.PointerStateMachine, event: MouseEvent | TouchEvent): void;
    static end(this: TouchHandler, state: IRub.PointerStateMachine, event: MouseEvent | TouchEvent): void;
}
//# sourceMappingURL=touch-handler.d.ts.map