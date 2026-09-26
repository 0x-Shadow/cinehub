import Hero from "../components/Hero.jsx";
import Rail from "../components/Rail.jsx";
import Reveal from "../components/Reveal.jsx";
import useTmdb from "../hooks/useTmdb.js";
import { movieList, trending } from "../api/tmdb.js";

export default function Home() {
  const trendingQuery = useTmdb(() => trending("all", "week"), []);
  const moviesQuery = useTmdb(() => trending("movie", "week"), []);
  const tvQuery = useTmdb(() => trending("tv", "week"), []);
  const topRatedQuery = useTmdb(() => movieList("vote_average.desc", { page: 1 }), []);

  const heroItem = trendingQuery.data?.results?.[0];

  return (
    <>
      <Hero
        title="Find your next favourite film."
        subtitle="Browse trending movies and TV shows, build a watchlist, and get picks tuned to your taste."
        backdrop={heroItem}
        items={trendingQuery.data?.results ?? []}
      />

      <div className="space-y-14 py-14">
        <Reveal>
          <Rail title="Trending this week" items={trendingQuery.data?.results ?? []} href="/search" loading={trendingQuery.loading} />
        </Reveal>
        <Reveal>
          <Rail title="Trending movies" items={moviesQuery.data?.results ?? []} href="/movies" loading={moviesQuery.loading} />
        </Reveal>
        <Reveal>
          <Rail title="Trending TV shows" items={tvQuery.data?.results ?? []} href="/tvshows" loading={tvQuery.loading} />
        </Reveal>
        <Reveal>
          <Rail title="Top rated" items={topRatedQuery.data?.results ?? []} href="/movies?sort=top_rated" loading={topRatedQuery.loading} />
        </Reveal>
      </div>
    </>
  );
}
