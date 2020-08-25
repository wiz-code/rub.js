import { TrackerInterface } from './interface.ts';

const { floor } = Math;

function SystemGetExecutedInLittleEndian(): boolean {
  if (new Uint8Array(new Uint16Array([0x00ff]).buffer)[0]) {
    return true;
  }
  return false;
}

export default class Tracker implements TrackerInterface {
  public readonly blockSize: number;

  protected tracks: Float32Array;

  protected end = 0;

  public constructor(length: number, blockSize: number) {
    this.blockSize = blockSize;

    try {
      this.tracks = new Float32Array(length * this.blockSize);
    } catch (e) {
      throw new Error('cannot allocate memory');
    }

    if (!SystemGetExecutedInLittleEndian()) {
      throw new Error('required little endian system');
    }
  }

  get count(): number {
    return floor(this.end / this.blockSize);
  }

  get size(): number {
    return floor(this.tracks.length / this.blockSize);
  }

  public setTrack(track: number[] | Float32Array, offset = 0): void {
    if (track.length % this.blockSize !== 0) {
      throw new Error('Track size not matched');
    }

    const position = offset * this.blockSize;
    this.tracks.set(track, position);

    if (position + track.length >= this.end) {
      this.end = position + track.length;
    }
  }

  /* addTrack(), getLastTrack()はRecorderクラスでの使用を想定 */
  public addTrack(track: number[]): void {
    if (track.length % this.blockSize !== 0) {
      throw new Error('Track size not matched');
    }

    this.tracks.set(track, this.end);
    this.end += track.length;
  }

  /* 任意の場所からトラックデータを取得する。引数に何も指定しない場合、最後のブロックを取得する */
  public getTrack(offset = -1, count = 1): Float32Array {
    const position =
      offset < 0
        ? (this.count + offset) * this.blockSize
        : offset * this.blockSize;

    const end = position + count * this.blockSize;
    const track = this.tracks.subarray(position, end);

    return track;
  }

  public clearTracks(): void {
    this.end = 0;
    this.tracks.fill(0);
  }

  public writeFrames(): void {
    this.clearTracks();

    for (let i = 0, l = this.tracks.length, count = 0; i < l; i += 1) {
      if (i % this.blockSize === 0) {
        this.tracks.set([count], i);
        count += 1;
      }
    }
  }

  public static create(length: number, blockSize: number): Tracker {
    return new Tracker(length, blockSize);
  }
}
