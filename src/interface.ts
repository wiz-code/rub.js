export interface TrackerInterface {
  readonly blockSize: number;

  count: number;

  size: number;

  setTrack(track: number[], offset: number): void;

  addTrack(track: number[]): void;

  getTrack(offset?: number, count?: number): Float32Array;

  clearTracks(): void;

  writeFrames(): void;
}

export type RecordMode = 'live' | 'playback' | 'external';

export type Record = Map<RecordMode, TrackerInterface>;

export type LoopCallback = (frames: number) => void;

export interface RecorderInterface {
  record: Record;

  update(ctime: number, velocity: number, activeTarget: number): void;

  getElapsedTime(): number;

  getFrames(): number;

  suspend(): void;

  resetFrames(): void;

  clearRecord(): void;

  getRecordCount(mode: RecordMode): number;

  getVelocities(offset: number, mode: RecordMode): number[];

  getRecord(mode: RecordMode): Float32Array;

  setRecord(tracks: Float32Array, mode: RecordMode): void;

  addData(data: number[]): void;

  getData(offset: number, count: number, mode: RecordMode): Float32Array;

  setData(track: number[], offset: number, mode: RecordMode): void;

  setShiftedFrames(frames: number): void;
}

export interface PointerHandlerInterface {
  getActiveTargetIndex(): number;

  getEventTrackCount(): number;

  getEventTrack(): Float32Array;

  clearEventTracks(): void;

  isAttached(): boolean;

  addListeners(el: HTMLDivElement): void;

  removeListeners(el: HTMLDivElement): void;
}

export interface TargetInterface {
  el: HTMLDivElement;

  state: TargetStateMachine;

  isActive(): boolean;
}

export type BoundsType = 'basic' | 'uptempo' | 'ballade' | 'rating';

export type Bounds = {
  recorder: RecorderInterface;
  event: PointerHandlerInterface;
};

export interface RubInterface {
  event: PointerHandlerInterface;
  recorder: RecorderInterface;
  media: MediaStateMachine;
  getId(): number;
  startLoop(): void;
  stopLoop(): void;
  clearLoop(): void;
  getCurrentBoundsType(): BoundsType;
  setBoundsType(key: BoundsType): void;
  setMediaCallback(callback: MediaStateCallback): void;
  addLoopCallback(callback: LoopCallback | LoopCallback[]): void;
  clearLoopCallback(): void;
}

export interface PointerStateMachine extends StateMachine.StateMachine {
  initialize(): void;
  start(): void;
  end(): void;
}

export interface TargetStateMachine extends StateMachine.StateMachine {
  initialize(): void;
  activate(): void;
  inactivate(): void;
}

export interface ListenerInterface {
  [index: string]: (event: MouseEvent | TouchEvent) => void;
}

export interface MediaStateMachine extends StateMachine.StateMachine {
  initialize(): void;

  ready(): void;

  reset(): void;

  start(): void;

  stop(): void;

  pause(): void;

  resume(): void;

  quit(): void;

  abort(): void;
}

export interface MediaStateCallback {
  oninitialize(): void;
  onready(): void;
  onreset(): void;
  onstart(): void;
  onstop(): void;
  onpause(): void;
  onresume(): void;
  onquit(): void;
  onabort(): void;

  oninitialized(): void;
  onrunning(): void;
  onpending(): void;
  onidling(): void;
  onerror(): void;
}
