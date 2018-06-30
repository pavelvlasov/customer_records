import test from "ava";
import { stub } from "sinon";
import { getFilteredUsers, User } from "../process";
import { DUBLIN_COORDINATES } from "../common/constants";
import { Writable } from "stream";
import { getDistance } from "../distance";

const mockOutStream = () => {
  return new Writable({
    write: () => {}
  });
};

const MAX_DISTANCE = 100000;

test.serial(
  "should reject with an error when file does not exists",
  async t => {
    const outStream = mockOutStream();
    const write = stub(outStream, "write");

    await t.throws(
      getFilteredUsers(
        Date.now().toString(),
        DUBLIN_COORDINATES,
        MAX_DISTANCE,
        outStream
      ),
      /no such file/
    );
    t.is(write.callCount, 0);
  }
);

test.serial("should reject with an error when file is invalid", async t => {
  const outStream = mockOutStream();
  const write = stub(outStream, "write");

  await t.throws(
    getFilteredUsers(
      "package.json",
      DUBLIN_COORDINATES,
      MAX_DISTANCE,
      outStream
    ),
    /Unexpected end of JSON input/
  );
  t.is(write.callCount, 0);
});

test.serial("should print custom records for existing file", async t => {
  const outStream = mockOutStream();
  const write = stub(outStream, "write");

  await getFilteredUsers(
    "test.txt",
    DUBLIN_COORDINATES,
    MAX_DISTANCE,
    outStream
  );
  t.is(write.callCount, 16);

  let prevId = 0;
  write.getCalls().forEach(call => {
    const userString = call.args[0] as string;
    const id = Number(userString.split(" ")[0]);

    // ids are sorted
    t.true(prevId < id);
  });
});
