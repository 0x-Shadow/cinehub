import React from "react";
import { useState, useEffect } from "react";

const useSearchMovies = (searchQuery) => {
  const [data, setQuery] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;
  const BASE_URL = "https://api.themoviedb.org/3";

  useEffect(() => {
    const fetchQuery = async () => {
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
        if (!response.ok) throw new Error("Error in searching movie");
        const data = await response.json();
        console.log(data);
        setQuery(data);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuery();
  }, [ACCESS_TOKEN, searchQuery]);
  return { data, error, loading };
};

export default useSearchMovies;
