// api/driver.js

import client from "./client";

const endpoint = "/api/driver";

export const getDriverInfo = async (driverId: number) => {
  try {
    const response = await client.get(`${endpoint}/id/${driverId}`);
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

export const getDriverInfoNew = async (driverId: number) => {
  try {
    const response = await client.get(`${endpoint}/user-id/${driverId}`);
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
