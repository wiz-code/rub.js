import * as IRub from './interface';
export default class Target implements IRub.TargetInterface {
    el: HTMLDivElement;
    state: IRub.TargetStateMachine;
    constructor(el: HTMLDivElement);
    isActive(): boolean;
}
//# sourceMappingURL=target.d.ts.map