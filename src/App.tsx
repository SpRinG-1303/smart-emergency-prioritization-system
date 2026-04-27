import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import StatsBar from "./components/StatsBar";
import SOSView from "./views/SOSView";
import VolunteerView from "./views/VolunteerView";
import DashboardView from "./views/DashboardView";
import { SOSAlert, ViewMode } from "./types";
import { MOCK_ALERTS } from "./data/mockData";
import { calculatePriorityScore } from "./utils/priority";

let nextId = 100;

export default function App() {
  const [view, setView] = useState<ViewMode>("volunteer");
  const [alerts, setAlerts] = useState<SOSAlert[]>(MOCK_ALERTS);
  const [toast, setToast] = useState<string | null>(null);

  const pendingAlerts = alerts.filter((a) => a.status === "pending");
  const assignedAlerts = alerts.filter((a) => a.status === "assigned");
  const completedAlerts = alerts.filter((a) => a.status === "completed");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Simulate real-time: waiting time increases
  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts((prev) =>
        prev.map((a) => {
          if (a.status === "completed") return a;
          const newWait = a.waitingMinutes + 1;
          const newScore = calculatePriorityScore(a.severity, newWait, a.disasterType);
          return { ...a, waitingMinutes: newWait, priorityScore: newScore };
        })
      );
    }, 30000); // update every 30s
    return () => clearInterval(interval);
  }, []);

  const handleSOSSubmit = (data: {
    name: string;
    disasterType: SOSAlert["disasterType"];
    severity: SOSAlert["severity"];
    description: string;
    address: string;
    priorityScore: number;
  }) => {
    const newAlert: SOSAlert = {
      id: `a${++nextId}`,
      name: data.name,
      location: { lat: 28.61 + Math.random() * 0.1, lng: 77.1 + Math.random() * 0.3 },
      address: data.address,
      severity: data.severity,
      disasterType: data.disasterType,
      description: data.description,
      timestamp: Date.now(),
      status: "pending",
      priorityScore: data.priorityScore,
      waitingMinutes: 0,
    };
    setAlerts((prev) => [...prev, newAlert]);
    showToast(`🚨 SOS received from ${data.name} — Priority Score: ${data.priorityScore}`);
  };

  const handleAssign = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id !== alertId) return a;
        if (a.status === "pending") {
          showToast(`🦺 Alert assigned! Navigating to victim...`);
          return { ...a, status: "assigned", assignedVolunteer: "v3" };
        }
        if (a.status === "assigned") {
          showToast(`✅ Victim rescued successfully!`);
          return { ...a, status: "completed" };
        }
        return a;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-900/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/5 rounded-full blur-3xl" />
      </div>

      <Navbar
        view={view}
        setView={setView}
        alertCount={pendingAlerts.length}
      />

      <main className="max-w-7xl mx-auto px-4 pt-20 pb-8">
        {/* Hero Header */}
        <div className="py-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <span className="text-red-400 text-sm font-semibold tracking-widest uppercase">
              Live Emergency System
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-1">
            Rescue<span className="text-red-500">Net</span>
            <span className="text-gray-500 font-light text-lg ml-3">
              Smart Disaster Response
            </span>
          </h1>
          <p className="text-gray-400 text-sm max-w-xl">
            AI-powered emergency prioritization — ensuring help reaches the right person at the right time.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6">
          <StatsBar
            pendingCount={pendingAlerts.length}
            assignedCount={assignedAlerts.length}
            completedCount={completedAlerts.length}
          />
        </div>

        {/* Views */}
        {view === "victim" && <SOSView onSubmit={handleSOSSubmit} />}
        {view === "volunteer" && (
          <VolunteerView alerts={alerts} onAssign={handleAssign} />
        )}
        {view === "dashboard" && <DashboardView alerts={alerts} />}
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-800 border border-gray-600 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold animate-bounce max-w-sm text-center">
          {toast}
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-4 text-gray-700 text-xs border-t border-gray-900">
        RescueNet v1.0 — Built for disaster response hackathon &nbsp;·&nbsp;
        <span className="text-red-800">Smart rescue system that ensures help reaches the right person at the right time.</span>
      </footer>
    </div>
  );
}
