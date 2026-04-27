import { SOSAlert, Volunteer } from "../types";
import { calculatePriorityScore } from "../utils/priority";

const makeAlert = (
  id: string,
  name: string,
  lat: number,
  lng: number,
  address: string,
  severity: 1 | 2 | 3 | 4 | 5,
  disasterType: SOSAlert["disasterType"],
  description: string,
  waitingMinutes: number,
  status: SOSAlert["status"],
  assignedVolunteer?: string
): SOSAlert => ({
  id,
  name,
  location: { lat, lng },
  address,
  severity,
  disasterType,
  description,
  timestamp: Date.now() - waitingMinutes * 60 * 1000,
  status,
  priorityScore: calculatePriorityScore(severity, waitingMinutes, disasterType),
  waitingMinutes,
  assignedVolunteer,
});

export const MOCK_ALERTS: SOSAlert[] = [
  makeAlert(
    "a1",
    "Rajesh Kumar",
    28.6139,
    77.209,
    "Connaught Place, New Delhi",
    5,
    "collapse",
    "Trapped under debris after building collapse. Cannot move. Send help immediately!",
    42,
    "pending"
  ),
  makeAlert(
    "a2",
    "Priya Sharma",
    28.6304,
    77.2177,
    "Karol Bagh, New Delhi",
    4,
    "flood",
    "Floodwater rising rapidly. Family of 5 stranded on rooftop. Children and elderly present.",
    28,
    "assigned",
    "v1"
  ),
  makeAlert(
    "a3",
    "Mohammed Ali",
    28.5672,
    77.3211,
    "Noida Sector 62, UP",
    5,
    "fire",
    "Building on fire, multiple people trapped on 3rd floor. Smoke is very thick.",
    15,
    "pending"
  ),
  makeAlert(
    "a4",
    "Sunita Devi",
    28.6448,
    77.2167,
    "Rohini Sector 7, Delhi",
    3,
    "medical",
    "Elderly woman collapsed, suspected heart attack. No transport available.",
    55,
    "pending"
  ),
  makeAlert(
    "a5",
    "Arjun Singh",
    28.5921,
    77.0442,
    "Dwarka Sector 12, Delhi",
    2,
    "flood",
    "Minor flooding in ground floor. Need sandbags or pumping assistance.",
    90,
    "completed"
  ),
  makeAlert(
    "a6",
    "Kavita Rao",
    28.6862,
    77.2217,
    "Civil Lines, Delhi",
    4,
    "earthquake",
    "Aftershock cracked walls, 2 people injured. House structurally unsafe. Need evacuation.",
    10,
    "pending"
  ),
  makeAlert(
    "a7",
    "Vikram Bose",
    28.5355,
    77.391,
    "Faridabad Sector 15, Haryana",
    1,
    "other",
    "Power lines down in neighborhood. No immediate injuries but danger to residents.",
    120,
    "completed"
  ),
  makeAlert(
    "a8",
    "Meena Gupta",
    28.7041,
    77.1025,
    "Pitampura, Delhi",
    3,
    "collapse",
    "Old compound wall collapsed due to heavy rain. Two people with minor injuries.",
    35,
    "assigned",
    "v2"
  ),
];

export const MOCK_VOLUNTEERS: Volunteer[] = [
  {
    id: "v1",
    name: "Team Alpha - NDRF",
    location: { lat: 28.6200, lng: 77.2100 },
    status: "busy",
    specialization: "Flood Rescue",
    assignedAlerts: ["a2"],
  },
  {
    id: "v2",
    name: "Team Bravo - Civil Defense",
    location: { lat: 28.6900, lng: 77.1100 },
    status: "busy",
    specialization: "Structural Rescue",
    assignedAlerts: ["a8"],
  },
  {
    id: "v3",
    name: "Team Charlie - Fire Dept.",
    location: { lat: 28.5500, lng: 77.3300 },
    status: "available",
    specialization: "Fire & Rescue",
    assignedAlerts: [],
  },
  {
    id: "v4",
    name: "Dr. Reema - Medical Unit",
    location: { lat: 28.6400, lng: 77.2000 },
    status: "available",
    specialization: "Medical Emergency",
    assignedAlerts: [],
  },
];

export const STATS = {
  totalSOS: 8,
  pending: 4,
  assigned: 2,
  completed: 2,
  criticalActive: 3,
  avgResponseTime: "14 min",
  livesSaved: 23,
  volunteersActive: 4,
};
