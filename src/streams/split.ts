import { Transform } from "stream";
import { StreamCallback } from "./common";

export const split = (): Transform => {
  return new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(
      chunk: string | Buffer,
      encoding: string,
      callback: StreamCallback
    ) {
      const strings = chunk instanceof Buffer ? chunk.toString() : chunk;

      strings.split("\n").forEach(line => {
        this.push(line);
      });

      callback();
    }
  });
};
