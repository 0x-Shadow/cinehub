import { img } from "../api/tmdb.js";

export default function CastStrip({ cast = [] }) {
  if (!cast.length) return null;
  return (
    <section className="space-y-4" aria-label="Top billed cast">
      <h2 className="text-lg font-semibold text-ink">Top billed cast</h2>
      <div className="rail -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {cast.map((person) => (
          <div key={person.id} className="flex w-24 shrink-0 flex-col items-center text-center">
            {person.profile_path ? (
              <img
                src={img(person.profile_path, "w300")}
                alt={person.name}
                loading="lazy"
                className="h-24 w-24 rounded-full object-cover"
                width={300}
                height={300}
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-surface-raised text-xl text-faint">
                {person.name.charAt(0)}
              </div>
            )}
            <p className="mt-2 line-clamp-2 text-xs font-medium text-ink">{person.name}</p>
            <p className="line-clamp-1 text-[11px] text-faint">{person.character}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
