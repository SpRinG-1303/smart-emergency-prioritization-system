import { useState } from "react";
import { AlertTriangle, MapPin, Mic, Send, CheckCircle, Loader, ChevronDown } from "lucide-react";
import { DisasterType, Severity } from "../types";
import { calculatePriorityScore, getPriorityLevel, getPriorityLabel, getPriorityBg, getDisasterEmoji } from "../utils/priority";

const DISASTER_TYPES: { value: DisasterType; label: string }[] = [
  { value: "collapse", label: "Building Collapse" },
  { value: "flood", label: "Flood / Water" },
  { value: "earthquake", label: "Earthquake" },
  { value: "fire", label: "Fire" },
  { value: "medical", label: "Medical Emergency" },
  { value: "other", label: "Other" },
];

type Step = "form" | "sending" | "confirmed";

interface SOSFormData {
  name: string;
  disasterType: DisasterType;
  severity: Severity;
  description: string;
  address: string;
}

interface SOSViewProps {
  onSubmit: (data: SOSFormData & { priorityScore: number }) => void;
}

export default function SOSView({ onSubmit }: SOSViewProps) {
  const [step, setStep] = useState<Step>("form");
  const [isListening, setIsListening] = useState(false);
  const [form, setForm] = useState<SOSFormData>({
    name: "",
    disasterType: "collapse",
    severity: 3,
    description: "",
    address: "Fetching location...",
  });

  const score = calculatePriorityScore(form.severity, 0, form.disasterType);
  const level = getPriorityLevel(score);

  const handleSOS = () => {
    setStep("sending");
    setTimeout(() => {
      onSubmit({ ...form, priorityScore: score });
      setStep("confirmed");
    }, 2200);
  };

  const handleVoice = () => {
    setIsListening(true);
    setTimeout(() => {
      setForm((f) => ({
        ...f,
        description: "Please help! I am trapped under debris, cannot move my legs. There is smoke nearby.",
        disasterType: "collapse",
        severity: 5,
      }));
      setIsListening(false);
    }, 2500);
  };

  const handleLocationFetch = () => {
    setForm((f) => ({ ...f, address: "Fetching GPS..." }));
    setTimeout(() => {
      setForm((f) => ({ ...f, address: "Connaught Place, New Delhi — 28.6139°N, 77.2090°E" }));
    }, 1500);
  };

  if (step === "sending") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-red-600/20 border-2 border-red-600 animate-ping absolute" />
          <div className="w-24 h-24 rounded-full bg-red-600/30 border-2 border-red-500 flex items-center justify-center">
            <Send className="w-10 h-10 text-red-400 animate-pulse" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-white text-2xl font-black mb-2">Sending SOS...</h2>
          <p className="text-gray-400">Broadcasting your location to rescue teams</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Loader className="w-4 h-4 text-red-400 animate-spin" />
            <span className="text-red-400 text-sm font-medium">Connecting to rescue network</span>
          </div>
        </div>
      </div>
    );
  }

  if (step === "confirmed") {
    const finalScore = calculatePriorityScore(form.severity, 0, form.disasterType);
    const finalLevel = getPriorityLevel(finalScore);
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 max-w-md mx-auto text-center px-4">
        <div className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-400" />
        </div>
        <div>
          <h2 className="text-white text-3xl font-black mb-2">SOS Sent! ✅</h2>
          <p className="text-gray-400 mb-6">Your request has been received and prioritized</p>

          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 text-left space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Priority Level</span>
              <span className={`px-3 py-1 rounded-full border text-sm font-black ${getPriorityBg(finalLevel)}`}>
                {getPriorityLabel(finalLevel)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Priority Score</span>
              <span className="text-white font-black text-xl">{finalScore}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Disaster Type</span>
              <span className="text-white text-sm">{getDisasterEmoji(form.disasterType)} {form.disasterType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Location Shared</span>
              <span className="text-green-400 text-xs">✓ GPS Active</span>
            </div>
            <div className="border-t border-gray-700 pt-3">
              <p className="text-yellow-400 text-sm font-semibold">
                ⏱️ Estimated Response: {finalLevel === "critical" ? "5-10 min" : finalLevel === "high" ? "10-20 min" : "20-40 min"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-4 w-full">
          <p className="text-blue-400 text-sm">
            💡 <strong>Stay calm.</strong> Keep your phone charged and stay in your current location. Rescue teams can see your position on the map.
          </p>
        </div>

        <button
          onClick={() => { setStep("form"); setForm({ name: "", disasterType: "collapse", severity: 3, description: "", address: "Fetching location..." }); }}
          className="text-gray-500 underline text-sm"
        >
          Send another SOS
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Big SOS Button */}
      <div className="flex flex-col items-center py-6">
        <button
          onClick={handleSOS}
          disabled={!form.name || !form.description}
          className="relative w-36 h-36 rounded-full bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-black text-3xl transition-all duration-200 shadow-2xl shadow-red-900/50 hover:scale-105 disabled:scale-100 border-4 border-red-400 disabled:border-gray-600"
        >
          <div className="absolute inset-0 rounded-full bg-red-600/30 animate-ping" />
          <span className="relative z-10">SOS</span>
        </button>
        <p className="text-gray-500 text-sm mt-3">Fill details below, then press SOS</p>
      </div>

      {/* Priority Preview */}
      <div className={`rounded-xl border p-3 flex items-center justify-between ${getPriorityBg(level)}`}>
        <span className="text-sm font-semibold">Current Priority Estimate</span>
        <div className="flex items-center gap-2">
          <span className="text-white font-black">Score: {score}</span>
          <span className="font-black">{getPriorityLabel(level)}</span>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-gray-400 text-sm font-medium block mb-1">Your Name *</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-600"
          />
        </div>

        {/* Disaster Type */}
        <div>
          <label className="text-gray-400 text-sm font-medium block mb-1">Type of Disaster *</label>
          <div className="relative">
            <select
              value={form.disasterType}
              onChange={(e) => setForm((f) => ({ ...f, disasterType: e.target.value as DisasterType }))}
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 appearance-none focus:outline-none focus:border-red-500 transition-colors"
            >
              {DISASTER_TYPES.map((d) => (
                <option key={d.value} value={d.value}>
                  {getDisasterEmoji(d.value)} {d.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Severity */}
        <div>
          <label className="text-gray-400 text-sm font-medium block mb-1">
            Severity Level: <span className="text-white font-bold">{form.severity}/5</span>
          </label>
          <div className="flex gap-2">
            {([1, 2, 3, 4, 5] as Severity[]).map((s) => (
              <button
                key={s}
                onClick={() => setForm((f) => ({ ...f, severity: s }))}
                className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${
                  form.severity === s
                    ? s >= 4 ? "bg-red-600 text-white" : s === 3 ? "bg-yellow-600 text-white" : "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-500 hover:bg-gray-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1 px-1">
            <span>Minor</span>
            <span>Moderate</span>
            <span>Critical</span>
          </div>
        </div>

        {/* Description + Voice */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-gray-400 text-sm font-medium">Situation Description *</label>
            <button
              onClick={handleVoice}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all ${
                isListening
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              <Mic className="w-3 h-3" />
              {isListening ? "Listening..." : "Voice SOS"}
            </button>
          </div>
          <textarea
            placeholder="Describe your situation in detail. E.g: I am trapped on 3rd floor, water rising..."
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-600 resize-none"
          />
        </div>

        {/* Location */}
        <div>
          <label className="text-gray-400 text-sm font-medium block mb-1">Location (Auto-detected)</label>
          <div className="flex gap-2">
            <div className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span className="text-gray-300 text-sm truncate">{form.address}</span>
            </div>
            <button
              onClick={handleLocationFetch}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl px-3 transition-colors"
            >
              <MapPin className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-950/30 border border-yellow-600/30 rounded-xl p-3 flex gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-400/80 text-xs">
            Only send SOS in real emergencies. False alerts reduce rescue efficiency and can put others at risk.
          </p>
        </div>
      </div>
    </div>
  );
}
