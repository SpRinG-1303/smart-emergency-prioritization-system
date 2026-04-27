import { Clock, MapPin, User, ChevronRight, Zap } from "lucide-react";
import { SOSAlert } from "../types";
import {
  getPriorityLevel,
  getPriorityBg,
  getPriorityLabel,
  getDisasterEmoji,
  formatWaiting,
} from "../utils/priority";

interface AlertCardProps {
  alert: SOSAlert;
  rank?: number;
  onClick: () => void;
  compact?: boolean;
}

export default function AlertCard({ alert, rank, onClick, compact }: AlertCardProps) {
  const level = getPriorityLevel(alert.priorityScore);
  const bgClass = getPriorityBg(level);
  const isCritical = level === "critical";

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl border cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-lg group ${
        isCritical
          ? "bg-red-950/40 border-red-600/50 shadow-red-900/20 shadow-md animate-[pulse_3s_ease-in-out_infinite]"
          : "bg-gray-900/60 border-gray-700/50 hover:border-gray-600"
      } ${compact ? "p-3" : "p-4"}`}
    >
      {/* Rank Badge */}
      {rank && (
        <div className="absolute -top-2 -left-2 bg-gray-800 border border-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-black text-gray-300">
          {rank}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getDisasterEmoji(alert.disasterType)}</span>
          <div>
            <div className="flex items-center gap-2">
              <User className="w-3 h-3 text-gray-500" />
              <span className="text-white font-bold text-sm">{alert.name}</span>
              {isCritical && (
                <Zap className="w-3 h-3 text-yellow-400 animate-pulse" />
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-gray-500" />
              <span className="text-gray-400 text-xs">{alert.address}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          {/* Priority Badge */}
          <span
            className={`px-2 py-0.5 rounded-full border text-xs font-black ${bgClass}`}
          >
            {getPriorityLabel(level)}
          </span>
          {/* Score */}
          <span className="text-gray-500 text-xs font-mono">
            Score: <span className="text-white font-bold">{alert.priorityScore}</span>
          </span>
        </div>
      </div>

      {!compact && (
        <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">
          {alert.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Severity dots */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i <= alert.severity
                    ? isCritical
                      ? "bg-red-500"
                      : "bg-orange-400"
                    : "bg-gray-700"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <Clock className="w-3 h-3" />
            {formatWaiting(alert.waitingMinutes)}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
              alert.status === "pending"
                ? "bg-red-500/20 text-red-400"
                : alert.status === "assigned"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-green-500/20 text-green-400"
            }`}
          >
            {alert.status === "pending"
              ? "Awaiting Help"
              : alert.status === "assigned"
              ? "Help En Route"
              : "✓ Rescued"}
          </span>
          <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
        </div>
      </div>
    </div>
  );
}
