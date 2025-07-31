// api/vehicle.js

import client from "./client";

const endpoint = "/api/vehicle";

export const getVehicleInfo = async (driverId: number) => {
  try {
    const response = await client.get(`${endpoint}/driver/id/${driverId}`);
    if (!response.ok) {
      console.error("Error fetching vehicle information:", response.problem);
      throw new Error(response.problem);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching vehicle information:", error);
    throw error;
  }
};
