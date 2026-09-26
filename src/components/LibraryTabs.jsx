import { useSearchParams } from "react-router-dom";
import Chip from "./Chip.jsx";

const TABS = [
  { key: "watchlist", label: "Watchlist" },
  { key: "favorites", label: "Favourites" },
  { key: "data", label: "Data" },
];

export default function LibraryTabs({ children }) {
  const [params, setParams] = useSearchParams();
  const active = params.get("tab") ?? "watchlist";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Chip key={t.key} active={active === t.key} onClick={() => setParams({ tab: t.key })}>
            {t.label}
          </Chip>
        ))}
      </div>
      {typeof children === "function" ? children(active) : children}
    </div>
  );
}
