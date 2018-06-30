import test from "ava";

import { stringify } from "../stringify";
import { pipeline, createReadStream } from "../../common/test-utils";

const toString = <TChunk>(chunk: TChunk) => JSON.stringify(chunk);

test("should process empty stream", async t => {
  const result = await pipeline(createReadStream([]), stringify(toString));

  t.deepEqual(result, []);
});

test("should process json lines", async t => {
  const result = await pipeline(
    createReadStream([{ foo: "foo" }, { bar: "bar" }], { objectMode: true }),
    stringify(toString)
  );

  t.deepEqual(result, [
    Buffer.from(JSON.stringify({ foo: "foo" }) + "\n"),
    Buffer.from(JSON.stringify({ bar: "bar" }) + "\n")
  ]);
});

test("should throw an error if json is invalid", async t => {
  // object with circular dependency
  const record: { self: Object | null } = { self: null };
  record.self = record;

  const promise = pipeline(
    createReadStream([record], { objectMode: true }),
    stringify(toString)
  );
  await t.throws(promise);
});
