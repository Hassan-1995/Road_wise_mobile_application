// api/fuelEntry.ts

import client from "./client";

const endpoint = "/api/vehicle/fuel/maintenance";

export const fuelLogCreateEntry = async (data: {
  driverId: number;
  vehicleId: number;
  liters: number;
  costRs: number;
  odometerKm: number;
  location?: string;
  notes?: string;
}) => {
  try {
    const response = await client.post(endpoint, data);

    if (!response.ok) {
      console.error("Error creating fuel entry:", response.problem);
      throw new Error(response.problem);
    }

    return response.data;
  } catch (error) {
    console.error("Error in fuelLogCreateEntry:", error);
    throw error;
  }
};
