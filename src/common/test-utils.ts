import { pipeline as _pipeline } from "stream";

import { Readable, ReadableOptions } from "stream";

class MockStream<TChunk> extends Readable {
  private index: number = 0;
  private chunks: TChunk[] = [];

  constructor(chunks: TChunk[], opts: ReadableOptions) {
    super(opts);

    this.chunks = chunks;
  }

  _read() {
    if (this.index < this.chunks.length) {
      this.push(this.chunks[this.index]);
      this.index += 1;
    } else {
      this.push(null);
    }
  }
}

export const createReadStream = <TChunk>(
  chunks: TChunk[],
  opts?: ReadableOptions
): Readable => {
  return new MockStream(chunks, opts || {});
};

export const pipeline = <TChunk>(
  stream1: any,
  stream2: any
): Promise<TChunk[]> => {
  return new Promise((resolve, reject) => {
    const chunks: TChunk[] = [];

    const stream = _pipeline(stream1, stream2, (err?: Error) => {
      if (err) {
        reject(err);
      }
      resolve(chunks);
    });

    stream.on("data", (chunk: TChunk) => {
      chunks.push(chunk);
    });
  });
};
