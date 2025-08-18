// api/optimisedPath.ts

import client from "./client";

const endpoint = "/api/actual-point-path";

// Create entry at trip start -- actual path taken by driver
export const insertActualPoints = async (data: {
  tripId: number;
  driverId: number;
  latitude: number;
  longitude: number;
  recordedAt: Date | string;
  sequence?: number | null;
  speed?: number | null;
  heading?: number | null;
}) => {
  const response = await client.post(endpoint, data);
  if (!response.ok) throw new Error(response.problem);
  return response.data;
};
