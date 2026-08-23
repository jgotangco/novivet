"use client";

import { useState, useEffect } from "react";
import { Sparkles, X } from "lucide-react";

export function WelcomeModeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState<"demo" | "production">("demo");
  const [showAgainOnNextVisit, setShowAgainOnNextVisit] = useState(true);

  useEffect(() => {
    const hideModalPref = localStorage.getItem("novivet_hide_mode_modal");
    const savedMode = localStorage.getItem("novivet_mode") as "demo" | "production";

    if (savedMode) {
      setCurrentMode(savedMode);
    }

    if (hideModalPref !== "true") {
      setIsOpen(true);
    }

    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener("novivet_open_mode_modal", handleOpenModal);
    return () => window.removeEventListener("novivet_open_mode_modal", handleOpenModal);
  }, []);

  const handleSelectMode = (mode: "demo" | "production") => {
    localStorage.setItem("novivet_mode", mode);
    if (!showAgainOnNextVisit) {
      localStorage.setItem("novivet_hide_mode_modal", "true");
    } else {
      localStorage.removeItem("novivet_hide_mode_modal");
    }
    setCurrentMode(mode);
    setIsOpen(false);
    window.dispatchEvent(new Event("novivet_mode_changed"));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="space-y-2 relative">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>NoviVet Clinical Cloud</span>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              title="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Select Environment Mode
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Choose whether to explore with pre-loaded clinical cases in Sandbox mode, or access the clean Production portal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
          <button
            type="button"
            onClick={() => handleSelectMode("demo")}
            className="p-5 rounded-2xl border-2 border-emerald-500 bg-gradient-to-b from-emerald-50/60 to-teal-50/30 text-left hover:shadow-lg transition flex flex-col justify-between space-y-4"
          >
            <div>
              <h3 className="font-bold text-base text-slate-900">Sandbox / Demo Mode</h3>
              <p className="text-xs text-slate-600 mt-1">Explore with sample patients, 1-click persona switchers, SOAP note simulator, and deployment guides.</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 font-mono">Launch Sandbox →</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectMode("production")}
            className="p-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-500 hover:shadow-lg transition flex flex-col justify-between space-y-4"
          >
            <div>
              <h3 className="font-bold text-base text-slate-900">Production Mode</h3>
              <p className="text-xs text-slate-600 mt-1">Connect to live hospital Cloud SQL, authenticate staff via credentials or Google OAuth.</p>
            </div>
            <span className="text-xs font-bold text-indigo-700 font-mono">Enter Production →</span>
          </button>
        </div>
      </div>
    </div>
  );
}
