import test from "ava";

import { filter } from "../filter";
import { pipeline, createReadStream } from "../../common/test-utils";

interface Chunk {
  index: number;
}
const predicate = (chunk: Chunk) => {
  if (chunk.index === undefined) {
    throw new Error("invalid payload");
  }
  return chunk.index > 3;
};

test("should process empty stream", async t => {
  const result = await pipeline(createReadStream([]), filter(predicate));

  t.deepEqual(result, []);
});

test("should filter chunk that don't match", async t => {
  const result = await pipeline(
    createReadStream([{ index: 0 }, { index: 3 }, { index: 4 }, { index: 5 }], {
      objectMode: true
    }),
    filter(predicate)
  );

  t.deepEqual(result, [{ index: 4 }, { index: 5 }]);
});

test("should throw an error if payload is invalid", async t => {
  const promise = pipeline(
    createReadStream([{}], { objectMode: true }),
    filter(predicate)
  );
  await t.throws(promise, /invalid payload/);
});
