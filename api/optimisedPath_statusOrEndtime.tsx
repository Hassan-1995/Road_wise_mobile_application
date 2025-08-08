// api/optimisedPath_statusOrEndtime.ts

import client from "./client";

const endpoint = "/api/update-status-or-endtime";

// Update trip status and/or end time
export const updateTripStatusOrEndTime = async (data: {
  tripId: number;
  status?: "Pending" | "Ongoing" | "Completed" | "Cancelled";
  updateEndTime?: boolean;
}) => {
  const response = await client.patch(endpoint, data);
  if (!response.ok) throw new Error(response.problem);
  return response.data;
};
