import { SOSAlert, Volunteer } from "../types";
import { getPriorityLevel, getPriorityColor } from "../utils/priority";

interface MapViewProps {
  alerts: SOSAlert[];
  volunteers: Volunteer[];
  selectedId: string | null;
  onSelectAlert: (id: string) => void;
}

export default function MapView({ alerts, volunteers, selectedId, onSelectAlert }: MapViewProps) {
  const MAP_LAT_MIN = 28.50;
  const MAP_LAT_MAX = 28.75;
  const MAP_LNG_MIN = 77.00;
  const MAP_LNG_MAX = 77.45;

  const toX = (lng: number) =>
    ((lng - MAP_LNG_MIN) / (MAP_LNG_MAX - MAP_LNG_MIN)) * 100;
  const toY = (lat: number) =>
    (1 - (lat - MAP_LAT_MIN) / (MAP_LAT_MAX - MAP_LAT_MIN)) * 100;

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-700/50 bg-gray-950">
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <rect width="100" height="100" fill="#0d1117" />
        {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((v) => (
          <g key={v}>
            <line x1={v} y1="0" x2={v} y2="100" stroke="#1a2332" strokeWidth="0.3" />
            <line x1="0" y1={v} x2="100" y2={v} stroke="#1a2332" strokeWidth="0.3" />
          </g>
        ))}
        <line x1="0" y1="50" x2="100" y2="50" stroke="#1e3a5f" strokeWidth="1" opacity="0.5" />
        <line x1="50" y1="0" x2="50" y2="100" stroke="#1e3a5f" strokeWidth="1" opacity="0.5" />
        <line x1="0" y1="30" x2="100" y2="70" stroke="#1e3a5f" strokeWidth="0.6" opacity="0.3" />
        <path d="M 60 0 Q 58 25 62 50 Q 65 75 60 100" fill="none" stroke="#1e40af" strokeWidth="2" opacity="0.4" />
        <rect x="20" y="20" width="25" height="25" fill="#0f2027" rx="2" opacity="0.5" />
        <rect x="55" y="15" width="20" height="20" fill="#0f2027" rx="2" opacity="0.5" />
        <rect x="15" y="60" width="30" height="20" fill="#0f2027" rx="2" opacity="0.5" />
        <rect x="60" y="55" width="25" height="25" fill="#0f2027" rx="2" opacity="0.5" />

        {volunteers.map((vol) => {
          const x = toX(vol.location.lng);
          const y = toY(vol.location.lat);
          const color = vol.status === "available" ? "#22c55e" : "#3b82f6";
          return (
            <g key={vol.id}>
              <circle cx={x} cy={y} r="2" fill={color} opacity="0.9" />
              <circle cx={x} cy={y} r="4" fill="none" stroke={color} strokeWidth="0.5" opacity="0.5" />
            </g>
          );
        })}

        {alerts.filter((a) => a.status !== "completed").map((alert) => {
          const x = toX(alert.location.lng);
          const y = toY(alert.location.lat);
          const level = getPriorityLevel(alert.priorityScore);
          const color = getPriorityColor(level);
          const isSelected = selectedId === alert.id;
          const isCritical = level === "critical";
          return (
            <g key={alert.id} onClick={() => onSelectAlert(alert.id)} style={{ cursor: "pointer" }}>
              {isCritical && (
                <circle cx={x} cy={y} r="6" fill="none" stroke={color} strokeWidth="0.5" opacity="0.4" />
              )}
              <circle cx={x} cy={y} r={isSelected ? 4 : 3} fill={color} opacity="0.3" />
              <circle cx={x} cy={y} r={isSelected ? 2.5 : 2} fill={color} opacity="0.9" />
              {isSelected && (
                <circle cx={x} cy={y} r="5" fill="none" stroke="white" strokeWidth="0.5" />
              )}
            </g>
          );
        })}
      </svg>

      <div className="absolute top-3 left-3 bg-gray-900/90 backdrop-blur rounded-lg px-2 py-1 border border-gray-700/50">
        <span className="text-gray-400 text-xs font-medium">🗺️ Delhi NCR — Live Incident Map</span>
      </div>

      <div className="absolute bottom-3 left-3 bg-gray-900/90 backdrop-blur rounded-lg p-2 border border-gray-700/50 space-y-1">
        {[
          { color: "#ef4444", label: "Critical" },
          { color: "#f97316", label: "High" },
          { color: "#eab308", label: "Medium" },
          { color: "#22c55e", label: "Low / Volunteer" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-gray-400 text-xs">{label}</span>
          </div>
        ))}
      </div>

      <div className="absolute top-3 right-3 space-y-1 max-w-[180px]">
        {alerts
          .filter((a) => a.status === "pending" && getPriorityLevel(a.priorityScore) === "critical")
          .slice(0, 2)
          .map((a) => (
            <div
              key={a.id}
              onClick={() => onSelectAlert(a.id)}
              className="bg-red-950/90 border border-red-600/50 rounded-lg px-2 py-1.5 cursor-pointer backdrop-blur"
            >
              <div className="text-red-400 text-xs font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping inline-block" />
                🚨 CRITICAL
              </div>
              <div className="text-white text-xs font-semibold truncate">{a.name}</div>
              <div className="text-gray-400 text-xs truncate">{a.address}</div>
            </div>
          ))}
      </div>

      <div className="absolute bottom-3 right-3 bg-gray-900/80 rounded px-2 py-1 border border-gray-800">
        <span className="text-gray-600 text-xs font-mono">28.6°N 77.2°E</span>
      </div>
    </div>
  );
}
