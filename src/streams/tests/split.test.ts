import test from "ava";

import { split } from "../split";
import { pipeline, createReadStream } from "../../common/test-utils";

test("should process empty stream", async t => {
  const result = await pipeline(createReadStream([]), split());

  t.deepEqual(result, []);
});

test("should process one line chunks", async t => {
  const result = await pipeline(createReadStream(["line1", "line2"]), split());

  t.deepEqual(result, ["line1", "line2"]);
});

test("should process multiple lines chunks", async t => {
  const result = await pipeline(
    createReadStream(["line1\nline2", "line3\nline4"]),
    split()
  );

  t.deepEqual(result, ["line1", "line2", "line3", "line4"]);
});
