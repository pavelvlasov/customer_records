import test from "ava";

import { sort } from "../sort";
import { pipeline, createReadStream } from "../../common/test-utils";

interface Chunk {
  index: number;
}
const compare = (firstChunk: Chunk, secondChunk: Chunk) => {
  if (firstChunk.index === undefined || secondChunk.index === undefined) {
    throw new Error("invalid payload");
  }
  return firstChunk.index - secondChunk.index;
};

test("should process empty stream", async t => {
  const result = await pipeline(createReadStream([]), sort(compare));

  t.deepEqual(result, []);
});

test("should sort chunk that don't match", async t => {
  const result = await pipeline(
    createReadStream([{ index: 4 }, { index: 2 }, { index: 1 }, { index: 5 }], {
      objectMode: true
    }),
    sort(compare)
  );

  t.deepEqual(result, [{ index: 1 }, { index: 2 }, { index: 4 }, { index: 5 }]);
});

test("should throw an error if payload is invalid", async t => {
  const promise = pipeline(
    createReadStream([{}, {}], { objectMode: true }),
    sort(compare)
  );
  await t.throws(promise, /invalid payload/);
});
