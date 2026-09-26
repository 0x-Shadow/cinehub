import { useState } from "react";
import useFetch from "../hooks/useFetch.js";
import useSearchMovies from "../hooks/useSearchMovies.js";

function Movies() {
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); //main trigger
  const { data, error, loading } = useFetch("/movie/popular");
  const {
    data: query,
    error: queryError,
    loading: queryLoading,
  } = useSearchMovies(searchQuery);
  if (error) return <p>{error}</p>;
  if (loading) return <p className="min-h-screen">Loading...</p>;
  return (
    // search section
    <div>
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
          {queryLoading ? "Loading..." : "Search"}
        </button>
      </div>

      {queryError && (
        <p className="text-center text-red-600 mt-4">
          Search Error:{queryError}
        </p>
      )}
      {query?.results?.length > 0 && (
        <div className="m-8 p-4 border border-yellow-400 bg-yellow-50 rounded-xl shadow-md text-center items-center">
          <h2 className="text-xl font-bold text-yellow-800">Results</h2>
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

      {/* Movies section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 m-8">
        {data?.results?.map((movie) => (
          <div
            key={movie.id}
            className="bg-white/5 p-3 rounded-xl shadow-md flex flex-col items-center text-center hover:transform hover:scale-105"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt="poster"
              className="w-48 h-auto rounded-xl"
            />
            <p className="mt-3 font-bold text-gray-900 text-2xl">
              {movie.title}
            </p>
            {/* <p className="text-gray-900 ">{movie.overview}</p> */}
            <p>{movie.release_date}</p>
            <p>Average rating : {movie.vote_average}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Movies;
