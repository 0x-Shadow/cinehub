import React, { useState } from "react";
import useFetch from "../hooks/useFetch";
import useSearchTvShows from "../hooks/useSearchTvShows";
function TvShows() {
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { data, error, loading } = useFetch("/tv/popular");
  const {
    data: query,
    error: queryError,
    Loading: queryLoading,
  } = useSearchTvShows(searchQuery);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-center items-center">
        <input
          type="text"
          name=""
          id=""
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Enter movie name"
          className="bg-white border border-gray rounded-2xl px-10 py-2 mt-3"
        />
        <button
          className="bg-blue-700 text-white rounded-2xl px-5 py-2 mt-3  ml-3 hover:bg-blue-800 cursor-pointer"
          onClick={() => setSearchQuery(searchText)}
          disabled={queryLoading}
        >
          {queryLoading ? " Searching " : "Search"}
        </button>
      </div>

      {queryError && (
        <p className="text-center text-red-600 mt-4">
          Search Error: {queryError}
        </p>
      )}
      {query?.results?.length > 0 && (
        <div className="m-8 p-4 border border-yellow-400 bg-yellow-50 rounded-xl shadow-md text-center items-center">
          <h2 className="text-xl font-bold text-yellow-800">Result</h2>
          <img
            src={`https://image.tmdb.org/t/p/w500/${query.results[0].poster_path}`}
            className="w-48 h-auto rounded-xl mx-auto"
            alt={query.results[0].title}
          />
          <p className="font-bold text-2xl">{query.results[0].title}</p>
          <p>{query.results[0].overview}</p>
          <p>{query.results[0].vote_average}</p>
        </div>
      )}

      {/* Tvshows section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 m-8">
        {data?.results?.map((tvshow) => (
          <div
            key={tvshow.id}
            className="bg-white/5 p-3 rounded-xl shadow-md flex flex-col items-center text-center hover:transform hover:scale-105"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500/${tvshow.poster_path}`}
              alt="poster"
              className={`w-48 h-auto rounded-xl`}
            />
            <p className="mt-3 font-bold text-gray-900 text-2xl">
              {tvshow.name}
            </p>
            <p>{tvshow.first_air_date}</p>
            <p>Average rating : {tvshow.vote_average}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TvShows;
