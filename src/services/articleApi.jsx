import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const KEY = import.meta.env.VITE_ARTICLE_RAPIDAPI;
// https://www.health.harvard.edu/staying-healthy/can-you-feel-younger-than-your-age

export const articleApi = createApi({
  reducerPath: "articleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://article-extractor-and-summarizer.p.rapidapi.com/",
    prepareHeaders: (headers) => {
      headers.set(
        "X-RapidAPI-Key",
        KEY
      );
      headers.set(
        "X-RapidAPI-Host",
        "article-extractor-and-summarizer.p.rapidapi.com"
      );
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getSummary: builder.query({
      query: (params) =>
        `/summarize?url=${encodeURIComponent(params.articleUrl)}&limit=3`,
    }),
  }),
});

export const { useLazyGetSummaryQuery } = articleApi;
