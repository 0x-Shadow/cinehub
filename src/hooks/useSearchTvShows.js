import React, { useEffect } from "react";
import { useState } from "react";

const useSearchTvShows = (searchQuery) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;
  const BASE_URL = "https://api.themoviedb.org/3";

  useEffect(() => {
    const fetchTvShows = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            searchQuery
          )}`,
          {
            headers: {
              Authorization: `Bearer ${ACCESS_TOKEN}`,
              accept: "application/json",
            },
          }
        );
        console.log(response);

        if (!response.ok) throw new Error("Error in fetching data");
        const data = response.json();
        console.log(data);

        setData(data);
        setError(null);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTvShows();
  }, [ACCESS_TOKEN, searchQuery]);
  return { data, error, loading };
};
export default useSearchTvShows;
