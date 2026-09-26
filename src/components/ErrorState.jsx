export default function ErrorState({ title = "Something went wrong", message, onRetry, className = "" }) {
  return (
    <div className={`flex flex-col items-center gap-3 px-6 py-16 text-center ${className}`}>
      <p className="text-lg font-semibold text-ink">{title}</p>
      {message ? <p className="max-w-md text-sm text-muted">{message}</p> : null}
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full border border-border px-5 py-2 text-sm font-medium text-ink transition hover:border-faint hover:bg-surface-raised"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
