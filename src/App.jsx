import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";
import Layout from "./Layout.jsx";
import Home from "./routes/Home.jsx";
import Movies from "./routes/Movies.jsx";
import TvShows from "./routes/TvShows.jsx";
import Search from "./routes/Search.jsx";
import Detail from "./routes/Detail.jsx";
import Library from "./routes/Library.jsx";
import NotFound from "./routes/NotFound.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/tvshows" element={<TvShows />} />
      <Route path="/search" element={<Search />} />
      <Route path="/:type/:id" element={<Detail />} />
      <Route path="/library" element={<Library />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  ),
  { basename: import.meta.env.BASE_URL }
);

export default function App() {
  return <RouterProvider router={router} />;
}
