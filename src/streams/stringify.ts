import { Transform } from "stream";
import { StreamCallback } from "./common";

export const stringify = <TChunk>(
  toString: (chunk: TChunk) => string
): Transform => {
  return new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(chunk: TChunk, encoding: string, callback: StreamCallback) {
      try {
        this.push(Buffer.from(toString(chunk)), "utf8");
      } catch (err) {
        return callback(err);
      }
      callback();
    }
  });
};
