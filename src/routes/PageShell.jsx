import { useEffect } from "react";

export default function PageShell({ title, description, children }) {
  useEffect(() => {
    document.title = title ? `${title} · CineHub` : "CineHub";
    if (description) {
      const el = document.querySelector('meta[name="description"]');
      if (el) el.setAttribute("content", description);
    }
  }, [title, description]);

  return <main className="mx-auto max-w-6xl px-4 sm:px-6">{children}</main>;
}
