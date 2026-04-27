import { AlertTriangle, CheckCircle, Clock, Users } from "lucide-react";
import { STATS } from "../data/mockData";

interface StatsBarProps {
  pendingCount: number;
  assignedCount: number;
  completedCount: number;
}

export default function StatsBar({ pendingCount, assignedCount, completedCount }: StatsBarProps) {
  const stats = [
    {
      label: "Active SOS",
      value: pendingCount,
      icon: <AlertTriangle className="w-4 h-4" />,
      color: "text-red-400",
      bg: "bg-red-500/10 border-red-500/30",
    },
    {
      label: "In Progress",
      value: assignedCount,
      icon: <Clock className="w-4 h-4" />,
      color: "text-orange-400",
      bg: "bg-orange-500/10 border-orange-500/30",
    },
    {
      label: "Rescued",
      value: completedCount + STATS.livesSaved,
      icon: <CheckCircle className="w-4 h-4" />,
      color: "text-green-400",
      bg: "bg-green-500/10 border-green-500/30",
    },
    {
      label: "Volunteers",
      value: STATS.volunteersActive,
      icon: <Users className="w-4 h-4" />,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/30",
    },
    {
      label: "Avg Response",
      value: STATS.avgResponseTime,
      icon: <Clock className="w-4 h-4" />,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`rounded-xl border p-3 flex flex-col gap-1 ${s.bg}`}
        >
          <div className={`flex items-center gap-1.5 ${s.color}`}>
            {s.icon}
            <span className="text-xs font-medium text-gray-400">{s.label}</span>
          </div>
          <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
        </div>
      ))}
    </div>
  );
}
