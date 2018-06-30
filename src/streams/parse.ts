import { Transform } from "stream";
import { StreamCallback } from "./common";

export const parse = (): Transform => {
  return new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(
      chunk: string | Buffer,
      encoding: string,
      callback: StreamCallback
    ) {
      try {
        this.push(
          JSON.parse(chunk instanceof Buffer ? chunk.toString() : chunk)
        );
      } catch (err) {
        return callback(err);
      }
      callback();
    }
  });
};
