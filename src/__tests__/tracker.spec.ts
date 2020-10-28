import Tracker from '../modules/tracker';

const values = [
  0,
  1,
  2,
  1000,
  1,
  2,
  2000,
  1,
  2,
  3000,
  1,
  2,
  4000,
  1,
  2,
  5000,
  1,
  2,
  6000,
  1,
  2,
  7000,
  1,
  2,
  8000,
  1,
  2,
  9000,
  1,
  2,
];

let sample;
// 4500, 100, 200

beforeEach(() => {
  sample = Tracker.create(10, 3);
  sample.setTrack(values);
});

describe('setTrack()', () => {
  test('set Float32Array[1, 2, 3]', () => {
    const tracker = Tracker.create(1, 3);
    tracker.setTrack([1, 2, 3]);
    expect(tracker.getTrack()).toEqual(new Float32Array([1, 2, 3]));
  });
});

describe('addTrack()', () => {
  test('set [1, 2, 3]', () => {
    const tracker = Tracker.create(1, 3);
    tracker.addTrack([1, 2, 3]);
    expect(tracker.getTrack()).toEqual(new Float32Array([1, 2, 3]));
  });

  test('set [1, 2, 3, 4, 5, 6]', () => {
    const tracker = Tracker.create(2, 3);
    tracker.addTrack([1, 2, 3, 4, 5, 6]);
    expect(tracker.getTrack()).toEqual(new Float32Array([4, 5, 6]));
  });

  test('different block size', () => {
    const tracker = Tracker.create(1, 3);
    expect(() => {
      tracker.addTrack([1000, 2000]);
    }).toThrow();
  });
});

describe('clearTracks()', () => {
  test('position set 0 when clearTracks()', () => {
    sample.clearTracks();
    expect(sample.count).toBe(0);
  });
});

describe('getTrack()', () => {
  test('returns empty array when refers non-existent value', () => {
    const tracker = Tracker.create(1, 3);

    const result = tracker.getTrack();
    expect(result).toEqual(new Float32Array([]));
  });

  test('returns last value of the array when passed no params', () => {
    const tracker = Tracker.create(2, 3);
    tracker.addTrack([1, 2, 3, 4, 5, 6]);

    const result = tracker.getTrack();
    expect(result).toEqual(new Float32Array([4, 5, 6]));
  });

  test('specified offset and size params', () => {
    const tracker = Tracker.create(3, 3);
    tracker.addTrack([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    const result = tracker.getTrack(1, 2);
    expect(result).toEqual(new Float32Array([4, 5, 6, 7, 8, 9]));
  });

  test('specified negative offset', () => {
    const tracker = Tracker.create(3, 3);
    tracker.addTrack([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    const result = tracker.getTrack(-2);
    expect(result).toEqual(new Float32Array([4, 5, 6]));
  });
});

describe('writeFrames()', () => {
  test('write frames as time series', () => {
    let tracker = Tracker.create(10, 2);
    tracker.writeFrames();
    expect(tracker.tracks).toEqual(
      new Float32Array([
        0,
        0,
        1,
        0,
        2,
        0,
        3,
        0,
        4,
        0,
        5,
        0,
        6,
        0,
        7,
        0,
        8,
        0,
        9,
        0,
      ])
    );

    tracker = Tracker.create(6, 3);
    tracker.writeFrames();
    expect(tracker.tracks).toEqual(
      new Float32Array([0, 0, 0, 1, 0, 0, 2, 0, 0, 3, 0, 0, 4, 0, 0, 5, 0, 0])
    );
  });
});
