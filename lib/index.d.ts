import * as IRub from './modules/interface';
export default class Rub implements IRub.MainInterface {
    private container;
    private id;
    private bounds;
    private currentBoundsType;
    private inputId;
    private outputId;
    private loopCallbacks;
    private input;
    private output;
    private offset;
    private t0;
    private x0;
    private y0;
    event: IRub.PointerHandlerInterface;
    recorder: IRub.RecorderInterface;
    media: IRub.MediaStateMachine;
    constructor(container: HTMLDivElement, callback?: IRub.LoopCallback | IRub.LoopCallback[]);
    getId(): number;
    startLoop(): void;
    stopLoop(): void;
    clearLoop(): void;
    getCurrentBoundsType(): IRub.BoundsType;
    setBoundsType(key: IRub.BoundsType): void;
    setMediaCallback(callback: IRub.MediaStateCallback): void;
    addLoopCallback(callback: IRub.LoopCallback | IRub.LoopCallback[]): void;
    clearLoopCallback(): void;
    private setEventHandler;
    private removeEventHandler;
    private resetBoundsType;
}
//# sourceMappingURL=index.d.ts.map