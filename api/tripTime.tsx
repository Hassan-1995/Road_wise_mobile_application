// api/tripTime.js

import client from "./client";

const endpoint = "/api/trip/id";

export const setTripTime = async ({
  tripId,
  startTime,
  endTime,
}: {
  tripId: number;
  startTime?: string;
  endTime?: string;
}) => {
  try {
    // Decide which field we’re updating
    let path = "";
    let payload: Record<string, any> = {};

    if (startTime) {
      path = "start-time";
      payload = { startTime };
    } else if (endTime) {
      path = "end-time";
      payload = { endTime };
    } else {
      throw new Error("Either startTime or endTime must be provided.");
    }

    const response = await client.put(`${endpoint}/${tripId}/${path}`, payload);

    if (!response.ok) {
      console.error("Error updating trip time:", response.problem);
      throw new Error(response.problem);
    }

    return response.data;
  } catch (error) {
    console.error("Error setting trip time:", error);
    throw error;
  }
};
