const { floor } = Math;

function SystemGetExecutedInLittleEndian(): boolean {
  if (new Uint8Array(new Uint16Array([0x00ff]).buffer)[0]) {
    return true;
  }
  return false;
}

export default class Tracker {
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

  public setTracks(tracks: number[] | Float32Array): void {
    this.clearTracks();

    if (Array.isArray(tracks)) {
      this.tracks = new Float32Array(tracks);
    } else {
      this.tracks = tracks;
    }
  }

  public setTrack(track: number[] | Float32Array, offset = 0): void {
    if (track.length % this.blockSize !== 0) {
      throw new Error('Track size not matched');
    }

    const { length } = this.tracks;
    let position = offset * this.blockSize;

    if (position >= length) {
      position %= length;
      this.end = position + track.length;
    } else if (position >= this.end) {
      this.end = position + track.length;
    }

    this.tracks.set(track, position);
  }

  /* addTrack()はPointerHandlerクラスでの使用を想定 */
  public addTrack(track: number[]): void {
    if (track.length % this.blockSize !== 0) {
      throw new Error('Track size not matched');
    }

    const { length } = this.tracks;

    if (this.end >= length) {
      this.end -= length;
    }

    this.tracks.set(track, this.end);

    this.end += track.length;
  }

  /* 最後のブロックを取得する */
  public getLastTrack(): Float32Array {
    const { length } = this.tracks;
    let position = (this.count - 1) * this.blockSize;

    position %= length;
    const track = this.tracks.slice(position, this.end);

    return track;
  }

  public getTrack(offset = 0, count = 1): Float32Array {
    const { length } = this.tracks;
    let position = offset * this.blockSize;

    if (position >= length) {
      position %= length;
    }

    const end = position + count * this.blockSize;
    const track = this.tracks.slice(position, end);

    return track;
  }

  public clearTracks(): void {
    this.end = 0;
    this.tracks.fill(0);
  }

  /* public writeFrames(): void {
    this.clearTracks();

    for (let i = 0, l = this.tracks.length, count = 0; i < l; i += 1) {
      if (i % this.blockSize === 0) {
        this.tracks.set([count], i);
        count += 1;
      }
    }
  } */
}
