import { Shield, Radio, Bell, Home } from "lucide-react";
import { ViewMode } from "../types";

interface NavbarProps {
  view: ViewMode;
  setView: (v: ViewMode) => void;
  alertCount: number;
}

export default function Navbar({ view, setView, alertCount }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur-md border-b border-red-900/40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Shield className="w-8 h-8 text-red-500" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          </div>
          <div>
            <span className="text-white font-black text-xl tracking-tight">
              Rescue<span className="text-red-500">Net</span>
            </span>
            <div className="flex items-center gap-1">
              <Radio className="w-3 h-3 text-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-medium">LIVE</span>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-gray-900 rounded-xl p-1 border border-gray-800">
          <button
            onClick={() => setView("home")}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              view === "home"
                ? "bg-red-600 text-white shadow-lg shadow-red-900/50"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Home className="w-4 h-4" />
          </button>
          {(["victim", "volunteer", "dashboard"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 capitalize ${
                view === v
                  ? "bg-red-600 text-white shadow-lg shadow-red-900/50"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {v === "victim"
                ? "🆘 SOS"
                : v === "volunteer"
                ? "🦺 Rescue"
                : "📊 Command"}
            </button>
          ))}
        </div>

        {/* Alert Bell */}
        <div className="relative">
          <Bell className="w-6 h-6 text-gray-400 hover:text-white transition-colors cursor-pointer" />
          {alertCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
              {alertCount}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
