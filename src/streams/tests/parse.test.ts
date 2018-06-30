import test from "ava";

import { parse } from "../parse";
import { pipeline, createReadStream } from "../../common/test-utils";

test("should process empty stream", async t => {
  const result = await pipeline(createReadStream([]), parse());

  t.deepEqual(result, []);
});

test("should process json lines", async t => {
  const result = await pipeline(
    createReadStream([
      JSON.stringify({ foo: "foo" }),
      JSON.stringify({ bar: "bar" }),
      JSON.stringify(null)
    ]),
    parse()
  );

  t.deepEqual(result, [{ foo: "foo" }, { bar: "bar" }]);
});

test("should throw an error if json is invalid", async t => {
  const promise = pipeline(createReadStream(["invalid json"]), parse());
  await t.throws(promise);
});
