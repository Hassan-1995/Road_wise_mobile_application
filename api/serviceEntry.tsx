// api/serviceEntry.ts

import client from "./client";

const endpoint = "/api/vehicle/service/maintenance";

export const serviceLogCreateEntry = async (data: {
  driverId: number;
  vehicleId: number;
  serviceType: string;
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
