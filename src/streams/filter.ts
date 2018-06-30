import { Transform } from "stream";
import { StreamCallback } from "./common";

type Predicate<TChunk> = (chunk: TChunk) => boolean;

export const filter = <TChunk>(predicate: Predicate<TChunk>): Transform => {
  return new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(chunk: TChunk, encoding: string, callback: StreamCallback) {
      try {
        if (predicate(chunk)) {
          this.push(chunk);
        }
      } catch (err) {
        return callback(err);
      }
      callback();
    }
  });
};
