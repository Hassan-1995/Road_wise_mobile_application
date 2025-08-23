import client from "./client";

const endpoint = "/api/driver";

export const getDriverID = async (userId: number) => {
  try {
    const response = await client.get(`${endpoint}/user-id/${userId}`);
    if (!response.ok) {
      console.error("Error fetching driver information:", response.problem);
      throw new Error(response.problem);
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching driver information:", error);
    throw error;
  }
};