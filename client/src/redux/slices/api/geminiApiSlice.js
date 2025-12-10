import { Gemini_URL } from "../../../utils/contants";
import { apiSlice } from "../apiSlice";

export const geminiApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    predictDeadline: builder.mutation({
      query: (taskId) => ({
        url: `${Gemini_URL}/analyze/${taskId}`, 
        method: "POST",
      }),
    }),
  }),
});

// 👇 Add this line to export the generated hook
export const { usePredictDeadlineMutation } = geminiApiSlice;