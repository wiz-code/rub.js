import * as IRub from './interface';
export default class Tracker implements IRub.TrackerInterface {
    readonly blockSize: number;
    protected tracks: Float32Array;
    protected end: number;
    constructor(length: number, blockSize: number);
    get count(): number;
    get size(): number;
    setTrack(track: number[] | Float32Array, offset?: number): void;
    addTrack(track: number[]): void;
    getTrack(offset?: number, count?: number): Float32Array;
    clearTracks(): void;
    writeFrames(): void;
    static create(length: number, blockSize: number): Tracker;
}
//# sourceMappingURL=tracker.d.ts.map