import { SOSAlert, Volunteer } from "../types";
import AlertCard from "../components/AlertCard";
import MapView from "../components/MapView";
import {
  sortAlertsByPriority,
  getDisasterEmoji,
} from "../utils/priority";
import { useState } from "react";
import { Activity, TrendingUp, Users, Zap } from "lucide-react";

interface DashboardViewProps {
  alerts: SOSAlert[];
  volunteers: Volunteer[];
}

export default function DashboardView({ alerts, volunteers }: DashboardViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sorted = sortAlertsByPriority(alerts);
  const completed = alerts.filter((a) => a.status === "completed");

  const disasterBreakdown: Record<string, number> = {};
  alerts.forEach((a) => {
    disasterBreakdown[a.disasterType] = (disasterBreakdown[a.disasterType] || 0) + 1;
  });

  return (
    <div className="space-y-4">
      {/* AI Engine Status */}
      <div className="bg-gradient-to-r from-purple-950/50 to-blue-950/50 border border-purple-500/30 rounded-2xl p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white font-black">🧠 AI Priority Engine</h3>
              <p className="text-gray-400 text-xs">
                Formula: (Severity × 5) + (Wait × 2) + Disaster Bonus
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-bold">ACTIVE — Processing {alerts.length} alerts</span>
          </div>
        </div>

        {/* Score Breakdown Example */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="bg-black/20 rounded-lg p-2">
            <div className="text-purple-400 text-xs font-mono">Severity × 5</div>
            <div className="text-white font-black">max 25 pts</div>
          </div>
          <div className="bg-black/20 rounded-lg p-2">
            <div className="text-purple-400 text-xs font-mono">Wait × 2 min</div>
            <div className="text-white font-black">max 40 pts</div>
          </div>
          <div className="bg-black/20 rounded-lg p-2">
            <div className="text-purple-400 text-xs font-mono">Disaster Bonus</div>
            <div className="text-white font-black">+5 to +20 pts</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Priority Queue */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-white font-black flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-red-400" />
            Live Priority Queue
          </h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {sorted
              .filter((a) => a.status !== "completed")
              .map((alert, i) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  rank={i + 1}
                  onClick={() => setSelectedId(alert.id === selectedId ? null : alert.id)}
                  compact
                />
              ))}
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-white font-black flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            Command Map
          </h3>
          <div className="h-[300px]">
            <MapView
              alerts={alerts}
              volunteers={volunteers}
              selectedId={selectedId}
              onSelectAlert={(id) => setSelectedId(id === selectedId ? null : id)}
            />
          </div>

          {/* Volunteer Status */}
          <div>
            <h3 className="text-white font-black flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-green-400" />
              Rescue Teams
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {volunteers.map((vol) => (
                <div
                  key={vol.id}
                  className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-3 flex items-center gap-3"
                >
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      vol.status === "available"
                        ? "bg-green-500 animate-pulse"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="text-white font-bold text-sm truncate">{vol.name}</div>
                    <div className="text-gray-400 text-xs">{vol.specialization}</div>
                  </div>
                  <span
                    className={`ml-auto text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${
                      vol.status === "available"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {vol.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Disaster Breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Object.entries(disasterBreakdown).map(([type, count]) => (
          <div
            key={type}
            className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-3 flex items-center gap-3"
          >
            <span className="text-2xl">{getDisasterEmoji(type)}</span>
            <div>
              <div className="text-white font-black text-xl">{count}</div>
              <div className="text-gray-400 text-xs capitalize">{type}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Completed */}
      {completed.length > 0 && (
        <div>
          <h3 className="text-white font-bold mb-2 text-sm">
            ✅ Rescued ({completed.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {completed.map((a) => (
              <div
                key={a.id}
                className="bg-green-950/20 border border-green-700/20 rounded-xl p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span>{getDisasterEmoji(a.disasterType)}</span>
                  <div>
                    <span className="text-gray-300 text-sm font-semibold">{a.name}</span>
                    <p className="text-gray-500 text-xs">{a.address}</p>
                  </div>
                </div>
                <span className="text-green-400 text-xs font-bold">✓ RESCUED</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
