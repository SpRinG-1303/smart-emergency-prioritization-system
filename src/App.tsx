import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import StatsBar from "./components/StatsBar";
import HomeView from "./views/HomeView";
import SOSView from "./views/SOSView";
import VolunteerView from "./views/VolunteerView";
import DashboardView from "./views/DashboardView";
import { SOSAlert, Volunteer, ViewMode } from "./types";
import { subscribeToAlerts, submitSOS, assignAlert, completeAlert, fetchVolunteers } from "./services/api";

export default function App() {
  const [view, setView] = useState<ViewMode>("home");
  const [alerts, setAlerts] = useState<SOSAlert[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const pendingAlerts = alerts.filter((a) => a.status === "pending");
  const assignedAlerts = alerts.filter((a) => a.status === "assigned");
  const completedAlerts = alerts.filter((a) => a.status === "completed");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Real-time Firestore listener for alerts
  useEffect(() => {
    const unsubscribe = subscribeToAlerts(setAlerts);
    return unsubscribe;
  }, []);

  // Fetch volunteers once on mount
  useEffect(() => {
    fetchVolunteers().then(setVolunteers);
  }, []);

  const handleSOSSubmit = async (data: {
    name: string;
    disasterType: SOSAlert["disasterType"];
    severity: SOSAlert["severity"];
    description: string;
    address: string;
    priorityScore: number;
  }) => {
    try {
      await submitSOS({
        name: data.name,
        location: { lat: 28.61 + Math.random() * 0.1, lng: 77.1 + Math.random() * 0.3 },
        address: data.address,
        severity: data.severity,
        disasterType: data.disasterType,
        description: data.description,
      });
      showToast(`🚨 SOS received from ${data.name} — Priority Score: ${data.priorityScore}`);
    } catch (err) {
      showToast("❌ Failed to send SOS. Please try again.");
    }
  };

  const handleAssign = async (alertId: string) => {
    const alert = alerts.find((a) => a.id === alertId);
    if (!alert) return;

    try {
      if (alert.status === "pending") {
        // Find nearest available volunteer
        const available = volunteers.find((v) => v.status === "available");
        const volunteerId = available?.id ?? "v_unknown";
        await assignAlert(alertId, volunteerId);
        showToast(`🦺 Alert assigned! Navigating to victim...`);
      } else if (alert.status === "assigned") {
        const volunteerId = alert.assignedVolunteer ?? "v_unknown";
        await completeAlert(alertId, volunteerId);
        showToast(`✅ Victim rescued successfully!`);
      }
    } catch (err) {
      showToast("❌ Update failed. Check connection.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-900/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/5 rounded-full blur-3xl" />
      </div>

      <Navbar view={view} setView={setView} alertCount={pendingAlerts.length} />

      <main className="max-w-7xl mx-auto px-4 pt-20 pb-8">
        {view !== "home" && (
          <>
            <div className="py-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                <span className="text-red-400 text-sm font-semibold tracking-widest uppercase">
                  Live Emergency System
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-1">
                Rescue<span className="text-red-500">Net</span>
                <span className="text-gray-500 font-light text-lg ml-3">Smart Disaster Response</span>
              </h1>
              <p className="text-gray-400 text-sm max-w-xl">
                AI-powered emergency prioritization — ensuring help reaches the right person at the right time.
              </p>
            </div>
            <div className="mb-6">
              <StatsBar
                pendingCount={pendingAlerts.length}
                assignedCount={assignedAlerts.length}
                completedCount={completedAlerts.length}
              />
            </div>
          </>
        )}

        {view === "home" && (
          <HomeView
            setView={setView}
            pendingCount={pendingAlerts.length}
            assignedCount={assignedAlerts.length}
            completedCount={completedAlerts.length}
          />
        )}
        {view === "victim" && <SOSView onSubmit={handleSOSSubmit} />}
        {view === "volunteer" && (
          <VolunteerView alerts={alerts} volunteers={volunteers} onAssign={handleAssign} />
        )}
        {view === "dashboard" && <DashboardView alerts={alerts} volunteers={volunteers} />}
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-800 border border-gray-600 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold animate-bounce max-w-sm text-center">
          {toast}
        </div>
      )}

      <footer className="text-center py-4 text-gray-700 text-xs border-t border-gray-900">
        RescueNet v1.0 — Built for disaster response hackathon &nbsp;·&nbsp;
        <span className="text-red-800">Smart rescue system that ensures help reaches the right person at the right time.</span>
      </footer>
    </div>
  );
}
