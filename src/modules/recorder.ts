import Tracker from './tracker';

const TRACK_SIZE = 216000;
const FPS = 60;
const PER_FRAME = 1000 / FPS;

const { round } = Math;

export type RecordMode = 'live' | 'playback' | 'external';
type Record = {
  [P in RecordMode]: Tracker;
};

export default class Recorder {
  public record: Record;

  private blockSize: number;

  private frames = 0;

  private started = false;

  private elapsedTime = 0;

  private lastTime = 0;

  private template: number[];

  private shiftedFrames: {
    [P in RecordMode]: number;
  };

  public constructor(els: HTMLDivElement[]) {
    const targetNum = els.length;

    this.blockSize = targetNum + 1;

    this.record = {
      live: this.createRecord(),
      playback: this.createRecord(),
      external: this.createRecord(),
    };

    this.shiftedFrames = {
      live: 0,
      playback: 0,
      external: 0,
    };

    this.template = Array(targetNum + 1).fill(0);
  }

  public update(ctime: number, velocity: number, targetIndex: number): void {
    const track = this.template.slice(0);
    const liveTracker = this.record.live;

    if (!this.started) {
      this.started = true;
      this.lastTime = ctime;

      track[0] = this.frames;
      liveTracker.setTrack(track, this.frames);
    } else {
      this.elapsedTime += ctime - this.lastTime;
      this.lastTime = ctime;

      const currentFrames = round(this.elapsedTime / PER_FRAME);

      if (currentFrames > this.frames) {
        this.frames = currentFrames;
        track[0] = this.frames;

        if (targetIndex > -1) {
          track[targetIndex + 1] = velocity;
        }

        liveTracker.setTrack(track, this.frames);
      }
    }
  }

  private createRecord(): Tracker {
    const tracker = new Tracker(TRACK_SIZE, this.blockSize);
    tracker.writeFrames();
    return tracker;
  }

  public getElapsedTime(): number {
    return this.elapsedTime;
  }

  public getFrames(): number {
    return this.frames;
  }

  public setFrames(frames: number): void {
    const track = this.template.slice(0);
    track[0] = frames;
    this.record.live.setTrack(track, frames);

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

  public clearRecord(mode: RecordMode = 'live'): void {
    // 不使用
    this.record[mode].writeFrames();
  }

  public getRecordCount(mode: RecordMode = 'live'): number {
    // 不使用
    return this.record[mode].count;
  }

  public getVelocity(offset = -1, mode: RecordMode = 'live'): number[] {
    const shifted = offset + this.shiftedFrames[mode];
    const track = this.record[mode].getTrack(shifted);
    const velocities = Array.from(track.subarray(1));
    return velocities;
  }

  public getRecord(mode: RecordMode = 'live'): Float32Array {
    const tracker = this.record[mode];
    return tracker.getTrack(0, tracker.size);
  }

  public setRecord(tracks: Float32Array, mode: RecordMode = 'live'): void {
    this.record[mode].setTrack(tracks);
  }

  public addData(data: number[]): void {
    // 削除予定
    this.record.live.addTrack(data);
  }

  public getData(
    offset = -1,
    count = 1,
    mode: RecordMode = 'live'
  ): Float32Array {
    // 不使用
    const shifted = offset + this.shiftedFrames[mode];
    return this.record[mode].getTrack(shifted, count);
  }

  public setData(track: number[], offset = 0, mode: RecordMode = 'live'): void {
    // 不使用
    this.record[mode].setTrack(track, offset);
  }

  public shiftFrames(frames: number, mode: RecordMode = 'playback'): void {
    this.shiftedFrames[mode] = frames;
  }
}
