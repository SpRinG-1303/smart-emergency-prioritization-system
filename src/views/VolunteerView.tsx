import { useState } from "react";
import { MapPin, Clock, User, CheckCircle, Navigation } from "lucide-react";
import { SOSAlert } from "../types";
import AlertCard from "../components/AlertCard";
import MapView from "../components/MapView";
import {
  sortAlertsByPriority,
  getPriorityLevel,
  getPriorityLabel,
  getPriorityBg,
  getDisasterEmoji,
  formatWaiting,
} from "../utils/priority";
import { MOCK_VOLUNTEERS } from "../data/mockData";

interface VolunteerViewProps {
  alerts: SOSAlert[];
  onAssign: (alertId: string) => void;
}

export default function VolunteerView({ alerts, onAssign }: VolunteerViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "assigned">("all");

  const filtered = sortAlertsByPriority(
    alerts.filter((a) =>
      a.status !== "completed" &&
      (filterStatus === "all" || a.status === filterStatus)
    )
  );

  const selected = alerts.find((a) => a.id === selectedId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-200px)] min-h-[500px]">
      {/* Left Panel: Priority Queue */}
      <div className="lg:col-span-2 flex flex-col gap-3 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-white font-black text-lg flex items-center gap-2">
            🚦 Priority Queue
            <span className="text-sm bg-red-600/20 text-red-400 border border-red-600/30 px-2 py-0.5 rounded-full font-bold">
              {filtered.length} active
            </span>
          </h2>
          <div className="flex gap-1">
            {(["all", "pending", "assigned"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterStatus === f
                    ? "bg-gray-700 text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Alert List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
          {filtered.map((alert, i) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              rank={i + 1}
              onClick={() => setSelectedId(alert.id === selectedId ? null : alert.id)}
              compact
            />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No active alerts</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Map + Detail */}
      <div className="lg:col-span-3 flex flex-col gap-3">
        {/* Map */}
        <div className="flex-1 min-h-[280px]">
          <MapView
            alerts={alerts}
            volunteers={MOCK_VOLUNTEERS}
            selectedId={selectedId}
            onSelectAlert={(id) => setSelectedId(id === selectedId ? null : id)}
          />
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="bg-gray-900/80 border border-gray-700/50 rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getDisasterEmoji(selected.disasterType)}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-gray-500" />
                    <span className="text-white font-black">{selected.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-black ${getPriorityBg(getPriorityLevel(selected.priorityScore))}`}>
                      {getPriorityLabel(getPriorityLevel(selected.priorityScore))}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {selected.address}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-black text-2xl">{selected.priorityScore}</div>
                <div className="text-gray-500 text-xs">Priority Score</div>
              </div>
            </div>

            <p className="text-gray-300 text-sm bg-gray-800/50 rounded-lg p-3 leading-relaxed">
              {selected.description}
            </p>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-gray-800/50 rounded-lg p-2">
                <div className="text-white font-bold">{selected.severity}/5</div>
                <div className="text-gray-500 text-xs">Severity</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-2">
                <div className="text-white font-bold flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3 text-orange-400" />
                  {formatWaiting(selected.waitingMinutes)}
                </div>
                <div className="text-gray-500 text-xs">Waiting</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-2">
                <div className="text-white font-bold">{selected.disasterType}</div>
                <div className="text-gray-500 text-xs">Type</div>
              </div>
            </div>

            {selected.status === "pending" && (
              <button
                onClick={() => onAssign(selected.id)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                Accept & Navigate to Victim
              </button>
            )}
            {selected.status === "assigned" && (
              <div className="flex gap-2">
                <div className="flex-1 bg-blue-950/40 border border-blue-500/30 rounded-xl p-3 text-center">
                  <p className="text-blue-400 text-sm font-semibold">Help En Route</p>
                  <p className="text-gray-400 text-xs">Assigned to: {selected.assignedVolunteer}</p>
                </div>
                <button
                  onClick={() => onAssign(selected.id)}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold px-4 rounded-xl transition-colors text-sm"
                >
                  ✓ Mark Rescued
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
