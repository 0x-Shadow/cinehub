import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import TasteOnboarding from "./components/TasteOnboarding.jsx";
import useLibrary from "./hooks/useLibrary.js";

export default function Layout() {
  const { onboarded, recordTaste, completeOnboarding } = useLibrary();
  const [showOnboarding, setShowOnboarding] = useState(!onboarded);

  const closeOnboarding = (liked, skipped) => {
    recordTaste(liked.map((e) => e.id), skipped);
    completeOnboarding();
    setShowOnboarding(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <ScrollToTop />
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />

      {showOnboarding && !onboarded ? (
        <div
          className="fixed inset-0 z-[70] overflow-y-auto bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Taste onboarding"
        >
          <div className="mx-auto max-w-4xl px-4 py-12">
            <div className="rounded-3xl border border-border bg-canvas p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-3xl text-ink">Welcome to CineHub</h2>
                <button
                  type="button"
                  onClick={() => {
                    completeOnboarding();
                    setShowOnboarding(false);
                  }}
                  className="text-sm text-muted transition hover:text-ink"
                >
                  Skip for now
                </button>
              </div>
              <TasteOnboarding onComplete={closeOnboarding} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
