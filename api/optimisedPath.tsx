// api/optimisedPath.ts

import client from "./client";

const endpoint = "/api/optimised-path";

// Create entry at trip start
export const createOptimisedPathEntry = async (data: {
  tripId: number;
  optimisedPath: string;
  distanceKm: string;
  durationMinutes: string;
  startTime: string;
  status: "Pending" | "Ongoing";
}) => {
  const response = await client.post(endpoint, data);
  if (!response.ok) throw new Error(response.problem);
  return response.data;
};

// Update entry later
export const updateOptimisedPathEntry = async (
  tripId: number,
  updates: Partial<{
    optimisedPath: string;
    distanceKm: string;
    durationMinutes: string;
    endTime: string;
    status: "Pending" | "Ongoing" | "Completed" | "Cancelled";
  }>
) => {
  const response = await client.patch(`${endpoint}/${tripId}`, updates);
  if (!response.ok) throw new Error(response.problem);
  return response.data;
};
