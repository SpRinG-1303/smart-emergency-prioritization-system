import { Shield, Zap, Map, BarChart3, AlertTriangle, CheckCircle, Clock, Users } from "lucide-react";
import { ViewMode } from "../types";

interface HomeViewProps {
  setView: (v: ViewMode) => void;
  pendingCount: number;
  assignedCount: number;
  completedCount: number;
}

export default function HomeView({ setView, pendingCount, assignedCount, completedCount }: HomeViewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
          <span className="text-red-400 text-sm font-semibold tracking-widest uppercase">Live Emergency System</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight">
          Rescue<span className="text-red-500">Net</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          AI-powered disaster response — ensuring help reaches the <span className="text-white font-semibold">right person</span> at the <span className="text-white font-semibold">right time</span>.
        </p>

        {/* Live stats strip */}
        <div className="flex items-center justify-center gap-6 flex-wrap pt-2">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-black text-xl">{pendingCount}</span>
            <span className="text-gray-500 text-sm">Active SOS</span>
          </div>
          <div className="w-px h-6 bg-gray-700" />
          <div className="flex items-center gap-2 text-orange-400">
            <Clock className="w-4 h-4" />
            <span className="font-black text-xl">{assignedCount}</span>
            <span className="text-gray-500 text-sm">In Progress</span>
          </div>
          <div className="w-px h-6 bg-gray-700" />
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span className="font-black text-xl">{completedCount}</span>
            <span className="text-gray-500 text-sm">Rescued</span>
          </div>
          <div className="w-px h-6 bg-gray-700" />
          <div className="flex items-center gap-2 text-blue-400">
            <Users className="w-4 h-4" />
            <span className="font-black text-xl">4</span>
            <span className="text-gray-500 text-sm">Teams Active</span>
          </div>
        </div>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Victim */}
        <button
          onClick={() => setView("victim")}
          className="group bg-red-950/30 border border-red-600/40 hover:border-red-500 hover:bg-red-950/50 rounded-2xl p-6 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-red-900/20"
        >
          <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center mb-4 group-hover:bg-red-600/30 transition-colors">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-white font-black text-xl mb-1">🆘 Send SOS</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            In danger? Submit an emergency alert. Our AI instantly calculates your priority score and notifies the nearest rescue team.
          </p>
          <div className="mt-4 text-red-400 text-sm font-semibold group-hover:text-red-300">
            I need help →
          </div>
        </button>

        {/* Volunteer */}
        <button
          onClick={() => setView("volunteer")}
          className="group bg-blue-950/30 border border-blue-600/40 hover:border-blue-500 hover:bg-blue-950/50 rounded-2xl p-6 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-900/20"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-white font-black text-xl mb-1">🦺 Rescue View</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Rescue teams see a live priority-sorted queue with map markers. Accept alerts, navigate to victims, and mark rescues complete.
          </p>
          <div className="mt-4 text-blue-400 text-sm font-semibold group-hover:text-blue-300">
            View alerts →
          </div>
        </button>

        {/* Dashboard */}
        <button
          onClick={() => setView("dashboard")}
          className="group bg-purple-950/30 border border-purple-600/40 hover:border-purple-500 hover:bg-purple-950/50 rounded-2xl p-6 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-900/20"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:bg-purple-600/30 transition-colors">
            <BarChart3 className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-white font-black text-xl mb-1">📊 Command</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Full situational overview — AI engine status, live map, volunteer tracking, and disaster breakdown analytics.
          </p>
          <div className="mt-4 text-purple-400 text-sm font-semibold group-hover:text-purple-300">
            Open dashboard →
          </div>
        </button>
      </div>

      {/* How it works */}
      <div className="bg-gray-900/50 border border-gray-700/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h3 className="text-white font-black text-lg">How the AI Priority Engine Works</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-3xl font-black text-white">Severity × 5</div>
            <div className="text-gray-400 text-sm">Up to 25 pts based on how critical the situation is</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-white">Wait × 2</div>
            <div className="text-gray-400 text-sm">Up to 40 pts — longer wait = higher urgency</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-white">+5 to +20</div>
            <div className="text-gray-400 text-sm">Disaster type bonus (collapse/fire score highest)</div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-3 flex-wrap text-xs">
          {[
            { label: "🚨 Critical", color: "bg-red-500/20 text-red-400 border-red-500/40", score: "≥65" },
            { label: "🔴 High", color: "bg-orange-500/20 text-orange-400 border-orange-500/40", score: "≥45" },
            { label: "🟡 Medium", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40", score: "≥25" },
            { label: "🟢 Low", color: "bg-green-500/20 text-green-400 border-green-500/40", score: "<25" },
          ].map(({ label, color, score }) => (
            <span key={label} className={`px-3 py-1 rounded-full border font-bold ${color}`}>
              {label} (score {score})
            </span>
          ))}
        </div>
      </div>

      {/* Map teaser */}
      <div className="flex items-center gap-3 bg-gray-900/40 border border-gray-700/40 rounded-xl p-4">
        <Map className="w-5 h-5 text-blue-400 flex-shrink-0" />
        <p className="text-gray-400 text-sm">
          Live incident map with color-coded markers available in the <button onClick={() => setView("volunteer")} className="text-blue-400 underline font-semibold">Rescue view</button> and <button onClick={() => setView("dashboard")} className="text-purple-400 underline font-semibold">Command dashboard</button>.
        </p>
      </div>
    </div>
  );
}
