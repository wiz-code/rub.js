import Tracker from './tracker';

const DURATION = 300;
const FPS = 60;
const PER_FRAME = 1000 / FPS;

const { round } = Math;

export type RecordMode = 'live' | 'playback' | 'external';
type Record = Map<RecordMode, Tracker>;

export default class Recorder {
  private records: Record = new Map();

  // private blockSize: number;
  private targetNum: number;

  private recordModes: Set<RecordMode> = new Set([
    'live',
    'playback',
    'external',
  ]);

  private frames = 0;

  private started = false;

  private elapsedTime = 0;

  private lastTime = 0;

  private updated = false;

  private template: number[];

  private shiftedFrames: Map<RecordMode, number> = new Map();

  private recordable = true;

  public constructor(els: HTMLDivElement[]) {
    // const targetNum = els.length;
    this.targetNum = els.length;

    // this.blockSize = targetNum + 1;

    this.recordModes.forEach((mode) => {
      this.records.set(mode, this.createRecord());
      this.shiftedFrames.set(mode, 0);
    });

    // this.template = Array(targetNum + 1).fill(0);
    this.template = Array(this.targetNum).fill(0);
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

        if (!this.recordable) {
          return;
        }

        if (targetIndex > -1) {
          // track[0] = this.frames;
          if (velocity === 0) {
            const oldTrack = liveTracker.getTrack(this.frames);
            // track[targetIndex + 1] = oldTrack[targetIndex + 1];
            track[targetIndex] = oldTrack[targetIndex];
          } else {
            // track[targetIndex + 1] = velocity;
            track[targetIndex] = velocity;
          }

          liveTracker.setTrack(track, this.frames);
        }
      }
    }
  }

  private createRecord(duration = DURATION): Tracker {
    const trackSize = duration * 60;
    // const tracker = new Tracker(trackSize, this.blockSize);
    const tracker = new Tracker(trackSize, this.targetNum);
    // tracker.writeFrames();
    return tracker;
  }

  public destroy(): void {
    this.recordModes.forEach((mode) => {
      this.records.set(mode, new Tracker(0, 0));
    });
  }

  public isRecordable(): boolean {
    return this.recordable;
  }

  public enableRecording(bool = true): void {
    this.recordable = bool;
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
    const track = this.template.slice(0);
    // track[0] = frames;
    (this.records.get('live') as Tracker).setTrack(track, frames);

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
    this.recordModes.forEach((mode) => {
      this.records.set(mode, this.createRecord(duration));
    });

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

  public getVelocity(offset: number): Map<RecordMode, number[]> {
    const map = new Map();

    this.recordModes.forEach((mode) => {
      const shifted = offset + <number>this.shiftedFrames.get(mode);
      const track = (this.records.get(mode) as Tracker).getTrack(shifted);
      // const velocity = Array.from(track.subarray(1));
      const velocity = Array.from(track.subarray(0));

      map.set(mode, velocity);
    });

    return map;
  }

  public getRecord(mode: RecordMode = 'live'): Float32Array {
    const tracker = this.records.get(mode) as Tracker;
    return tracker.getTrack(0, tracker.size);
  }

  public setRecord(tracks: Float32Array, mode: RecordMode = 'live'): void {
    (this.records.get(mode) as Tracker).setTrack(tracks);
  }

  public addData(data: number[]): void {
    // 削除予定
    (this.records.get('live') as Tracker).addTrack(data);
  }

  public getRecentBlockData(
    offset = 0,
    count = 1
  ): Map<RecordMode, Float32Array> {
    const map = new Map();

    this.recordModes.forEach((mode) => {
      const start = offset + <number>this.shiftedFrames.get(mode) - (count - 1);
      const tracker = this.records.get(mode) as Tracker;

      if (start < 0) {
        map.set(mode, tracker.getTrack());
      } else {
        const tracks = tracker.getTrack(start, count);
        map.set(mode, tracks);
      }
    });

    return map;
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
    return this.updated;
  }
}
