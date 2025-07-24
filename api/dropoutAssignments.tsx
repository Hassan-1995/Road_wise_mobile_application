// api/dropoutAssignments.js

import client from "./client";

const endpoint = "/api/dropout-assignment";

const getDropoutAssignmentsByTripId = async (tripId) => {
  try {
    const response = await client.get(`${endpoint}/${tripId}`);
    if (!response.ok) {
      console.error("Error fetching dropout assignments:", response.problem);
      throw new Error(response.problem);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching dropout assignments:", error);
    throw error;
  }
};

export default {
  getDropoutAssignmentsByTripId,
};
