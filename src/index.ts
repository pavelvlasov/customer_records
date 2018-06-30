import { getFilteredUsers } from "./process";
import { DUBLIN_COORDINATES } from "./common/constants";

getFilteredUsers("test.txt", DUBLIN_COORDINATES, 100000, process.stdout).catch(
  err => {
    console.error(err);
  }
);
