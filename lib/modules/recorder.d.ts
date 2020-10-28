import * as IRub from './interface';
export default class Recorder implements IRub.RecorderInterface {
    record: IRub.Record;
    private blockSize;
    private frames;
    private started;
    private elapsedTime;
    private lastTime;
    private template;
    private shiftedFrames;
    constructor(els: HTMLDivElement[]);
    update(ctime: number, velocity: number, targetIndex: number): void;
    private createRecord;
    getElapsedTime(): number;
    getFrames(): number;
    setFrames(frames: number): void;
    suspend(): void;
    resetFrames(): void;
    clearRecord(mode?: IRub.RecordMode): void;
    getRecordCount(mode?: IRub.RecordMode): number;
    getVelocities(offset?: number, mode?: IRub.RecordMode): number[];
    getRecord(mode?: IRub.RecordMode): Float32Array;
    setRecord(tracks: Float32Array, mode?: IRub.RecordMode): void;
    addData(data: number[]): void;
    getData(offset?: number, count?: number, mode?: IRub.RecordMode): Float32Array;
    setData(track: number[], offset?: number, mode?: IRub.RecordMode): void;
    setShiftedFrames(frames: number, mode?: IRub.RecordMode): void;
}
//# sourceMappingURL=recorder.d.ts.map