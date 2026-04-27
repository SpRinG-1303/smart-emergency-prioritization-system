import { SOSAlert, PriorityLevel, Severity } from "../types";

/**
 * PRIORITY SCORING ENGINE (AI Logic)
 * Score = (severity * 5) + (waitingMinutes * 2) + (disasterBonus)
 * Max theoretical score ≈ 100+
 */
export function calculatePriorityScore(
  severity: Severity,
  waitingMinutes: number,
  disasterType: string
): number {
  const severityScore = severity * 5; // max 25
  const waitingScore = Math.min(waitingMinutes * 2, 40); // capped at 40
  const disasterBonus: Record<string, number> = {
    collapse: 20,
    earthquake: 18,
    flood: 15,
    fire: 17,
    medical: 16,
    other: 5,
  };
  const bonus = disasterBonus[disasterType] ?? 5;
  return Math.round(severityScore + waitingScore + bonus);
}

export function getPriorityLevel(score: number): PriorityLevel {
  if (score >= 65) return "critical";
  if (score >= 45) return "high";
  if (score >= 25) return "medium";
  return "low";
}

export function getPriorityColor(level: PriorityLevel): string {
  switch (level) {
    case "critical":
      return "#ef4444"; // red
    case "high":
      return "#f97316"; // orange
    case "medium":
      return "#eab308"; // yellow
    case "low":
      return "#22c55e"; // green
  }
}

export function getPriorityBg(level: PriorityLevel): string {
  switch (level) {
    case "critical":
      return "bg-red-500/20 border-red-500 text-red-400";
    case "high":
      return "bg-orange-500/20 border-orange-500 text-orange-400";
    case "medium":
      return "bg-yellow-500/20 border-yellow-500 text-yellow-400";
    case "low":
      return "bg-green-500/20 border-green-500 text-green-400";
  }
}

export function getPriorityLabel(level: PriorityLevel): string {
  switch (level) {
    case "critical":
      return "🚨 CRITICAL";
    case "high":
      return "🔴 HIGH";
    case "medium":
      return "🟡 MEDIUM";
    case "low":
      return "🟢 LOW";
  }
}

export function sortAlertsByPriority(alerts: SOSAlert[]): SOSAlert[] {
  return [...alerts].sort((a, b) => b.priorityScore - a.priorityScore);
}

export function getDisasterEmoji(type: string): string {
  const map: Record<string, string> = {
    flood: "🌊",
    earthquake: "🌍",
    fire: "🔥",
    collapse: "🏚️",
    medical: "🏥",
    other: "⚠️",
  };
  return map[type] ?? "⚠️";
}

export function formatWaiting(minutes: number): string {
  if (minutes < 60) return `${minutes}m ago`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m ago`;
}
