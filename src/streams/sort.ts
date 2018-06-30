import { Transform } from "stream";
import { StreamCallback } from "./common";

type CompareFunction<TChunk> = (first: TChunk, second: TChunk) => number;

export const sort = <TChunk>(
  compareFunction: CompareFunction<TChunk>
): Transform => {
  const chunks: TChunk[] = [];

  return new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(chunk: TChunk, encoding: string, callback: StreamCallback) {
      chunks.push(chunk);
      callback();
    },
    flush(callback: StreamCallback) {
      try {
        chunks.sort(compareFunction);

        chunks.forEach(chunk => {
          this.push(chunk);
        });
      } catch (err) {
        return callback(err);
      } finally {
        callback();
      }
    }
  });
};
