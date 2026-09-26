import { img, watchProviders } from "../api/tmdb.js";

export default function WatchProviders({ providers }) {
  const parsed = watchProviders(providers);
  if (!parsed) return null;

  const options = [
    ...parsed.flatrate.map((p) => ({ ...p, kind: "Stream" })),
    ...parsed.rent.map((p) => ({ ...p, kind: "Rent" })),
    ...parsed.buy.map((p) => ({ ...p, kind: "Buy" })),
  ];
  if (!options.length) return null;

  return (
    <section className="space-y-3" aria-label="Where to watch">
      <h2 className="text-lg font-semibold text-ink">Where to watch</h2>
      <div className="flex flex-wrap items-center gap-4">
        {options.map((p) => (
          <div key={p.provider_id} className="flex items-center gap-2" title={`${p.kind}: ${p.provider_name}`}>
            {p.logo_path ? (
              <img
                src={img(p.logo_path, "w92")}
                alt={p.provider_name}
                className="h-9 w-9 rounded-lg"
                width={92}
                height={92}
              />
            ) : null}
            <span className="text-xs text-muted">{p.provider_name}</span>
          </div>
        ))}
        {parsed.link ? (
          <a
            href={parsed.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-accent underline-offset-2 transition hover:underline"
          >
            View all options
          </a>
        ) : null}
      </div>
    </section>
  );
}
