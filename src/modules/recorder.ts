import Tracker from './tracker';

const FPS = 60;
const PER_FRAME = 1000 / FPS;

const { round } = Math;
const result = new Map();

export type RecordMode = 'live' | 'record-1' | 'record-2';
type Record = Map<RecordMode, Tracker>;

export default class Recorder {
  private records: Record = new Map();

  // private blockSize: number;
  private targetNum: number;

  private recordModes: Set<RecordMode> = new Set([
    'live',
    'record-1',
    'record-2',
  ]);

  private frames = 0;

  private started = false;

  private elapsedTime = 0;

  private lastTime = 0;

  private updated = false;

  private template: Float32Array;

  private shiftedFrames: Map<RecordMode, number> = new Map();

  private recordable = true;

  private overwrite = false;

  public constructor(els: HTMLDivElement[]) {
    // const targetNum = els.length;
    this.targetNum = els.length;

    this.recordModes.forEach((mode) => {
      this.records.set(mode, this.createRecord());
      this.shiftedFrames.set(mode, 0);
    });

    this.template = new Float32Array(this.targetNum).fill(0);
  }

  public update(ctime: number, velocity: number, targetIndex: number): void {
    const track = this.template.slice(0);
    const liveTracker = this.records.get('live') as Tracker;

    this.updated = velocity > 0;

    // 開始時点のフレームには何も書き込まない
    if (!this.started) {
      this.started = true;
      this.lastTime = ctime;
    } else {
      this.elapsedTime += ctime - this.lastTime;
      this.lastTime = ctime;

      const currentFrames = round(this.elapsedTime / PER_FRAME);

      if (currentFrames > this.frames) {
        this.frames = currentFrames;

        if (liveTracker.size === 0 || !this.recordable) {
          return;
        }

        if (targetIndex > -1) {
          track[targetIndex] = velocity;
          liveTracker.setTrack(track, this.frames);
        } else if (this.overwrite) {
          liveTracker.setTrack(track, this.frames);
        }
      }
    }
  }

  private createRecord(duration = 0): Tracker {
    const trackSize = duration * FPS;
    const tracker = new Tracker(trackSize, this.targetNum);
    return tracker;
  }

  public destroy(): void {
    this.records.clear();
    /* this.recordModes.forEach((mode) => {
      this.records.set(mode, new Tracker(0, 0));
    }); */
  }

  public isRecordable(): boolean {
    return this.recordable;
  }

  public enableRecording(bool = true): void {
    this.recordable = bool;
  }

  public enableOverwrite(bool = true): void {
    this.overwrite = bool;
  }

  /* public getBlockSize(): number {
    return this.blockSize;
  } */
  public getTargetNum(): number {
    return this.targetNum;
  }

  public getElapsedTime(): number {
    return this.elapsedTime;
  }

  public getFrames(): number {
    return this.frames;
  }

  public setFrames(frames: number): void {
    const liveTracker = this.records.get('live') as Tracker;

    if (liveTracker.size !== 0) {
      const track = this.template.slice(0);
      liveTracker.setTrack(track, frames);
    }

    const diff = frames - this.frames;
    const shift = diff * PER_FRAME;
    this.elapsedTime += shift;
    this.frames = frames;
  }

  public suspend(): void {
    this.started = false;
  }

  public resetFrames(): void {
    this.frames = 0;
    this.started = false;
    this.lastTime = 0;
    this.elapsedTime = 0;
  }

  public resizeRecord(duration: number): void {
    this.records.set('live', this.createRecord(duration));
    this.resetFrames();
  }

  public clearRecord(mode: RecordMode = 'live'): void {
    // (this.records.get(mode) as Tracker).writeFrames();
    (this.records.get(mode) as Tracker).clearTracks();
  }

  public getRecordCount(mode: RecordMode = 'live'): number {
    // 不使用
    return (this.records.get(mode) as Tracker).count;
  }

  public getVelocity(offset: number): Map<RecordMode, Float32Array> {
    result.clear();

    this.recordModes.forEach((mode) => {
      const shifted = offset + <number>this.shiftedFrames.get(mode);
      const track = (this.records.get(mode) as Tracker).getTrack(shifted);
      let velocity;

      if (track.length === 0) {
        velocity = this.template.slice(0);
      } else {
        velocity = track.subarray(0);
      }

      result.set(mode, velocity);
    });

    return result;
  }

  public hasRecord(mode: RecordMode = 'live'): boolean {
    const tracker = this.records.get(mode) as Tracker;
    return tracker.size > 0;
  }

  public getRecord(mode: RecordMode = 'live'): Float32Array {
    const tracker = this.records.get(mode) as Tracker;
    return tracker.getTrack(0, tracker.size);
  }

  public setRecord(tracks: Float32Array, mode: RecordMode = 'live'): void {
    (this.records.get(mode) as Tracker).setTracks(tracks);
  }

  public addData(data: number[]): void {
    // 削除予定
    (this.records.get('live') as Tracker).addTrack(data);
  }

  public getRecentBlockData(
    offset = 0,
    count = 1
  ): Map<RecordMode, Float32Array> {
    result.clear();

    this.recordModes.forEach((mode) => {
      const start = offset + <number>this.shiftedFrames.get(mode) - (count - 1);
      const tracker = this.records.get(mode) as Tracker;

      if (tracker.size === 0 || start < 0) {
        const track = this.template.slice(0);
        result.set(mode, track);
      } else {
        const tracks = tracker.getTrack(start, count);
        result.set(mode, tracks);
      }
    });

    return result;
  }

  public getData(
    offset = -1,
    count = 1,
    mode: RecordMode = 'live'
  ): Float32Array {
    // 不使用
    const shifted = offset + <number>this.shiftedFrames.get(mode);
    return (this.records.get(mode) as Tracker).getTrack(shifted, count);
  }

  public setData(track: number[], offset = 0, mode: RecordMode = 'live'): void {
    // 不使用
    (this.records.get(mode) as Tracker).setTrack(track, offset);
  }

  public getShiftedFrames(mode: RecordMode = 'live'): number {
    return <number>this.shiftedFrames.get(mode);
  }

  public shiftFrames(frames: number, mode: RecordMode = 'live'): void {
    this.shiftedFrames.set(mode, frames);
  }

  public isUpdated(): boolean {
    return this.recordable && this.updated;
  }
}
