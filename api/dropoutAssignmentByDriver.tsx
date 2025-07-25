// api/dropoutAssignments.js

import client from "./client";

const endpoint = "/api/dropout-assignment";

export const getDropoutAssignmentsByDriver = async (driverId: number) => {
  try {
    const response = await client.get(`${endpoint}/driver/${driverId}`);
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
