export type Coordinates = { lat: number; lon: number };

// Earth radius in meters
const EARTH_RADIUS = 6371e3;

const toRadians = (angle: number): number => (angle * Math.PI) / 180;

// returns distance between two GPS coordinates in meters
export const getDistance = (
  first: Coordinates,
  second: Coordinates
): number => {
  const f1 = toRadians(first.lat);
  const f2 = toRadians(second.lat);
  const deltaF = toRadians(second.lat - first.lat);
  const deltaL = toRadians(second.lon - first.lon);

  const a =
    Math.sin(deltaF / 2) * Math.sin(deltaF / 2) +
    Math.cos(f1) * Math.cos(f2) * Math.sin(deltaL / 2) * Math.sin(deltaL / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS * c;
};
