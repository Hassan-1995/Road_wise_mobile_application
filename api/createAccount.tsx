// api/createAccount.js

import client from "./client";

const endpoint = "/api/new-user/driver";

export const createDriver = async (data: {
  name: string;
  email: string;
  password: string;
  phone: string;
}) => {
  try {
    const response = await client.post(endpoint, data);

    if (!response.ok) {
      console.error("Error creating driver account:", response.problem);
      throw new Error(response.problem);
    }

    return response.data;
  } catch (error) {
    console.error("Error in createDriver:", error);
    throw error;
  }
};
