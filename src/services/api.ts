import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { SOSAlert, Volunteer } from "../types";
import { calculatePriorityScore } from "../utils/priority";

// ── Firebase config ──────────────────────────────────────────
const app = initializeApp({
  apiKey: "AIzaSyB4TNsW5L6K35JyfziNTNrSphNbMzVAuq8",
  authDomain: "disaster-response-system-c62ba.firebaseapp.com",
  projectId: "disaster-response-system-c62ba",
  storageBucket: "disaster-response-system-c62ba.firebasestorage.app",
  messagingSenderId: "619982078922",
  appId: "1:619982078922:web:9749ef9e472526025dc533",
});

export const db = getFirestore(app);

// ── Helpers ──────────────────────────────────────────────────

/** Convert a Firestore doc into our SOSAlert shape */
function docToAlert(id: string, data: Record<string, any>): SOSAlert {
  const ts: Timestamp = data.timestamp;
  const timestampMs = ts?.seconds ? ts.seconds * 1000 : Date.now();
  const waitingMinutes = Math.floor((Date.now() - timestampMs) / 60000);
  const severity = (data.severity ?? 3) as SOSAlert["severity"];
  const disasterType = (data.disasterType ?? "other") as SOSAlert["disasterType"];

  return {
    id,
    name: data.name ?? "Unknown",
    location: data.location ?? { lat: 0, lng: 0 },
    address: data.address ?? "Unknown location",
    severity,
    disasterType,
    description: data.description ?? "",
    timestamp: timestampMs,
    status: data.status ?? "pending",
    priorityScore: calculatePriorityScore(severity, waitingMinutes, disasterType),
    waitingMinutes,
    assignedVolunteer: data.assignedVolunteer,
  };
}

function docToVolunteer(id: string, data: Record<string, any>): Volunteer {
  return {
    id,
    name: data.name ?? "Unknown",
    location: data.location ?? { lat: 0, lng: 0 },
    status: data.available === false ? "busy" : "available",
    specialization: data.specialization ?? "General",
    assignedAlerts: data.assignedAlert ? [data.assignedAlert] : [],
  };
}

// ── Real-time alerts listener ────────────────────────────────

/** Subscribes to live alert updates. Returns unsubscribe fn. */
export function subscribeToAlerts(callback: (alerts: SOSAlert[]) => void): () => void {
  return onSnapshot(collection(db, "alerts"), (snapshot) => {
    const alerts: SOSAlert[] = snapshot.docs.map((d) => docToAlert(d.id, d.data()));
    callback(alerts);
  });
}

// ── Submit SOS ───────────────────────────────────────────────

export async function submitSOS(
  data: Pick<SOSAlert, "name" | "location" | "address" | "severity" | "disasterType" | "description">
): Promise<void> {
  await addDoc(collection(db, "alerts"), {
    ...data,
    timestamp: new Date(),
    status: "pending",
  });
}

// ── Update alert status ──────────────────────────────────────

export async function assignAlert(alertId: string, volunteerId: string): Promise<void> {
  await updateDoc(doc(db, "alerts", alertId), {
    status: "assigned",
    assignedVolunteer: volunteerId,
  });
  await updateDoc(doc(db, "volunteers", volunteerId), {
    available: false,
    assignedAlert: alertId,
  });
}

export async function completeAlert(alertId: string, volunteerId: string): Promise<void> {
  await updateDoc(doc(db, "alerts", alertId), { status: "completed" });
  await updateDoc(doc(db, "volunteers", volunteerId), {
    available: true,
    assignedAlert: null,
  });
}

// ── Fetch volunteers (one-time) ──────────────────────────────

export async function fetchVolunteers(): Promise<Volunteer[]> {
  const snap = await getDocs(collection(db, "volunteers"));
  return snap.docs.map((d) => docToVolunteer(d.id, d.data()));
}
