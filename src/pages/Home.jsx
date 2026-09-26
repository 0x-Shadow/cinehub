import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";

function Home() {
  const { data, loading, error } = useFetch("/movie/now_playing");
  if (loading)
    return <div className="min-h-screen flex justify-center">Loading...</div>;
  if (error)
    return <div className="min-h-screen flex justify-center">{error}</div>;
  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      <section className="py-60 bg-gradient-to-br from-blue-300 to-blue-700">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h1 className="font-bold mb-6 text-5xl md:text-6xl">
            Welcome to CineHub
          </h1>

          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Browse and discover thousands of movies and TV shows. Browse about
            your favourite movies and shows.
          </p>
          <div className="space-x-4">
            <Link
              to="/movies"
              className="bg-blue-500  text-white font-semibold rounded-lg px-8 py-3 border-2 border-whit hover:bg-blue-600  transition duration-300 inline-block"
            >
              Browse Movies
            </Link>
            <Link
              to="/tvshows"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300 inline-block"
            >
              Browse TV Shows
            </Link>
          </div>
        </div>
      </section>
      <section className="bg-gray-50 py-16">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-bold text-2xl text-gray-800"> Now playing in Cinemas</h2>
            <Link
              to="/movies"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Movies
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.results?.map((nowplaying) => (
              <div
                key={nowplaying.id}
                className="bg-white/5 p-3 rounded-xl shadow-md flex flex-col items-center text-center hover:transform hover:scale-105"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500/${nowplaying.poster_path}`}
                  alt="poster"
                  className="w-48 h-auto rounded-xl"
                />
                <p className="mt-3 font-bold text-gray-900 text-2xl">
                  {nowplaying.title}
                </p>
                <p className="mt-1 text-gray-600 text-sm">
                  {nowplaying.release_date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
