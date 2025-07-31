// api/dropoutAssignments.js

import client from "./client";

const endpoint = "/api/dropout-assignment";

export const updatingStatusByDriver = async (
  driverId: number,
  storeId: number,
  tripId: number,
  status: string
) => {
  try {
    const response = await client.put(
      `${endpoint}/driver/${driverId}/store/${storeId}/trip/${tripId}`,
      { status }
    );

    if (!response.ok) {
      console.error("Error updating status:", response.problem);
      throw new Error(response.problem);
    }

    return response.data;
  } catch (error) {
    console.error("Error updating dropout assignment:", error);
    throw error;
  }
};
