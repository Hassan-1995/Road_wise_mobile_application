// api/dropoutAssignments.js

import client from "./client";

const endpoint = "/api/dropout-assignment";


// this function gets trips + drop-off points assigned to driver
export const getDropoutAssignmentsByTrip = async (tripId: number) => {
  try {
    const response = await client.get(`${endpoint}/trip/${tripId}`);
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
