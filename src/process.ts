import { split, parse, filter, sort, stringify } from "./streams";
import { pipeline, Writable } from "stream";
import { getDistance, Coordinates } from "./distance";
import { createReadStream } from "fs";
import { promisify } from "util";

export interface User {
  user_id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export const getFilteredUsers = (
  filename: string,
  location: Coordinates,
  maxDistance: number,
  outStream: Writable
): Promise<void> => {
  return promisify(pipeline)(
    createReadStream(filename),
    split(),
    parse(),
    filter((user: User) => {
      return (
        getDistance(
          {
            lat: user.latitude,
            lon: user.longitude
          },
          location
        ) <= maxDistance
      );
    }),
    sort(
      (firstUser: User, secondUser: User) =>
        firstUser.user_id - secondUser.user_id
    ),
    stringify((user: User) => `${user.user_id} ${user.name}\n`),
    outStream
  );
};
