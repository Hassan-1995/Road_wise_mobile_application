// api/tripByID.js

import client from "./client";

const endpoint = "/api/trip/id";

export type Trip = {
  id: number;
  vehicleId: number;
  driverId: number;
  startTime: string | null; // ISO string, nullable
  endTime: string | null; // ISO string, nullable
  distanceKm: number | null;
  notes: string | null;
  status: "In_Progress" | "Completed" | "Pending" | string; // extend if needed
  createdAt: string; // ISO string
};

export const getTripDetail = async ({ tripID }: { tripID: number }) => {
  try {
    const response = await client.get(`${endpoint}/${tripID}`);

    if (!response.ok) {
      console.error("Error fetching trip information:", response.problem);
      throw new Error(response.problem);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching trip information:", error);
    throw error;
  }
};
