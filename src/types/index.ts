export type Severity = 1 | 2 | 3 | 4 | 5;
export type Status = "pending" | "assigned" | "completed";
export type DisasterType =
  | "flood"
  | "earthquake"
  | "fire"
  | "collapse"
  | "medical"
  | "other";

export interface SOSAlert {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  address: string;
  severity: Severity;
  disasterType: DisasterType;
  description: string;
  timestamp: number;
  status: Status;
  priorityScore: number;
  waitingMinutes: number;
  assignedVolunteer?: string;
}

export interface Volunteer {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  status: "available" | "busy";
  specialization: string;
  assignedAlerts: string[];
}

export type ViewMode = "victim" | "volunteer" | "dashboard";
export type PriorityLevel = "critical" | "high" | "medium" | "low";
