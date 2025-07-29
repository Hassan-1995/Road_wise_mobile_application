import client from "./client";

const endpoint = "/api/trip";

export const getTripByDriver = async (driverId: number) => {
  try {
    const response = await client.get(`${endpoint}/driver/id/${driverId}`);
    if (!response.ok) {
      console.error("Error fetching trips made by driver:", response.problem);
      throw new Error(response.problem);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching trips made by driver:", error);
    throw error;
  }
};
