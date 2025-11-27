// redux/slices/api/geminiApiSlice.js
import { apiSlice } from "../apiSlice";

export const geminiApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    predictDeadline: builder.query({
      query: (taskId) => ({
        url: `/gemini/analyze/${taskId}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { usePredictDeadlineQuery } = geminiApiSlice;
