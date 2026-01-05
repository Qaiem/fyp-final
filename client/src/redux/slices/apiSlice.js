// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const API_URL = import.meta.env.VITE_APP_BASE_URL;
// //+ "/api";
// //const API_URL = "http://localhost:8800/api";
// // const API_URL = "https://mern-tm-server.onrender.com/api";

// const baseQuery = fetchBaseQuery({ baseUrl: API_URL + "/api" });



// export const apiSlice = createApi({
//   baseQuery,
//   tagTypes: [],
//   endpoints: () => ({}),
// });


import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Use your hardcoded URL for debugging, but we can switch to env later
// If VITE_API_URL exists (AWS), use it. Otherwise use localhost.
const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "http://3.111.47.71:8800/api"; 

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // --- DEBUGGING START ---
    const state = getState();
    
    console.group("🛑 API Request Debugger");
    console.log("1. Base URL:", BASE_URL);
    console.log("2. Full Redux State:", state);
    
    // Check specifically what is inside auth
    console.log("3. Auth Slice:", state.auth);
    
    // Attempt to grab token from Redux
    const reduxToken = state.auth?.userInfo?.token;
    console.log("4. Token found in Redux:", reduxToken);

    // Check LocalStorage just in case Redux is empty (e.g. after refresh)
    const localStrg = localStorage.getItem("userInfo");
    console.log("5. LocalStorage 'userInfo':", localStrg);
    // --- DEBUGGING END ---

    // Logic: Use Redux token, otherwise try to parse from LocalStorage
    let token = reduxToken;

    if (!token && localStrg) {
        try {
            const parsedUser = JSON.parse(localStrg);
            token = parsedUser.token;
            console.log("6. ⚠️ Redux was empty, recovered token from LocalStorage:", token);
        } catch (err) {
            console.error("Error parsing LocalStorage:", err);
        }
    }

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
      console.log("✅ Authorization header set successfully.");
    } else {
      console.error("❌ NO TOKEN FOUND. Request will return 401.");
    }
    
    console.groupEnd();
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User", "Task"],
  endpoints: () => ({}),
});