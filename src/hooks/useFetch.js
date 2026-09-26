import React from "react";
import { useEffect, useState } from "react";

const useFetch = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ACCESS_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;
  const BASE_URL = "https://api.themoviedb.org/3";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            accept: "application/json",
          },
        });
        console.log(response);

        if (!response.ok) throw new Error("Error in fetching data.");
        const data = await response.json();
        console.log(data);

        setData(data);
        setError(null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ACCESS_TOKEN, endpoint]);
  return {data, loading, error};
};

export default useFetch;
