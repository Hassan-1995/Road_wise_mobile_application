// // api/createAccount.js

// import client from "./client";

// const endpoint = "/api/login-user/driver";

// type LoginResponse = {
//   message: string;
//   token: string;
//   user: {
//     id: number;
//     name: string;
//     email: string;
//     phone: string;
//     role: string;
//   };
// };

// export const loginDriver = async (data: {
//   email: string;
//   password: string;
// }):<LoginResponse> => {
//   try {
//     const response = await client.post<LoginResponse>(endpoint, data);

//     if (!response.ok) {
//       console.error("Error creating driver account:", response.problem);
//       throw new Error(response.problem);
//     }

//     return response.data;
//   } catch (error) {
//     console.error("Error in createDriver:", error);
//     throw error;
//   }
// };

// api/createAccount.ts

import client from "./client";

const endpoint = "/api/login-user/driver";

type LoginResponse = {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
  };
};

export const loginDriver = async (data: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  try {
    const response = await client.post<LoginResponse>(endpoint, data);

    if (!response.ok || !response.data) {
      console.error("Error creating driver account:", response.problem);
      throw new Error(response.problem || "Unknown error");
    }

    return response.data;
  } catch (error) {
    console.error("Error in createDriver:", error);
    throw error;
  }
};
