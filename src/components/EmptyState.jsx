export default function EmptyState({ title = "Nothing here yet", message, action, icon }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      {icon ? <div className="mb-1 text-3xl" aria-hidden="true">{icon}</div> : null}
      <p className="text-lg font-semibold text-ink">{title}</p>
      {message ? <p className="max-w-md text-sm text-muted">{message}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
