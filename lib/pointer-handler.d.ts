import * as IRub from './interface';
declare abstract class PointerHandler implements IRub.PointerHandlerInterface {
    protected state: IRub.PointerStateMachine;
    protected listener: IRub.ListenerInterface;
    protected targets: IRub.TargetInterface[];
    protected coords: IRub.TrackerInterface;
    protected attached: boolean;
    constructor(els: HTMLDivElement[]);
    protected findTargetIndex(predicate: (target: IRub.TargetInterface) => boolean): number;
    getActiveTargetIndex(): number;
    getEventTrackCount(): number;
    getEventTrack(): Float32Array;
    clearEventTracks(): void;
    isAttached(): boolean;
    abstract addListeners(el: HTMLDivElement): void;
    abstract removeListeners(el: HTMLDivElement): void;
}
export default PointerHandler;
//# sourceMappingURL=pointer-handler.d.ts.map