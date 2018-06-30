import test from "ava";

import { getDistance } from "../distance";
import { DUBLIN_COORDINATES } from "../common/constants";

test("should return 0 for distance between equal points", t => {
  t.is(getDistance({ lat: 0, lon: 0 }, { lat: 0, lon: 0 }), 0);
  t.is(getDistance(DUBLIN_COORDINATES, DUBLIN_COORDINATES), 0);
});

test("should return proper distance between points", t => {
  const sydneyCoordinates = { lat: -33.865143, lon: 151.2099 };
  const moscowCoordinates = { lat: 55.751244, lon: 37.618423 };
  const londonCoordiates = { lat: 51.509865, lon: -0.118092 };

  t.is(getDistance(DUBLIN_COORDINATES, sydneyCoordinates), 17214735.194877606);
  t.is(getDistance(DUBLIN_COORDINATES, moscowCoordinates), 2794883.4890164738);
  t.is(getDistance(DUBLIN_COORDINATES, londonCoordiates), 463146.7760971132);
});
