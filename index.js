// ================= FIREBASE IMPORTS =================
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  doc
} from "firebase/firestore";

// ================= FIREBASE CONFIG =================
const firebaseConfig = {
  apiKey: "AIzaSyB4TNsW5L6K35JyfziNTNrSphNbMzVAuq8",
  authDomain: "disaster-response-system-c62ba.firebaseapp.com",
  projectId: "disaster-response-system-c62ba",
  storageBucket: "disaster-response-system-c62ba.firebasestorage.app",
  messagingSenderId: "619982078922",
  appId: "1:619982078922:web:9749ef9e472526025dc533"
};

// ================= INIT =================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function calculatePriority(alert,volunteerLocation){
    const severeWeight=5
    const timeWeight=2
    const severeScore=alert.severity *severeWeight
    const currentTime=Date.now();
    const waitingTime=(currentTime-alert.timestamp.seconds*1000)/1000
    const timeScore=(waitingTime*timeWeight)/60
    const distance=getDistance(
        alert.location.lat,alert.location.lng,
        volunteerLocation.lat,volunteerLocation.lng
    )
    const distanceScore=100/(distance+1);
    const priorityScore=severeScore+timeScore+distanceScore;
    return priorityScore;
}
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
function sortAlerts(alerts,volunteerLocation){
    return alerts.sort((a,b)=>{
        const scoreA=calculatePriority(a,volunteerLocation);
        const scoreB=calculatePriority(b,volunteerLocation);
        return (scoreB-scoreA);

    })
}
function getPriorityLevel(score){
    if (score>=80){
        return "HIGH";}
    if (score>=50){
        return "MEDIUM";}
    return "LOW";
}
function findNearestVolunteer(alert,volunteers){
    let bestVolunteer=null;
    let minDistance=Infinity;
    volunteers.forEach(volunteer => {
        const distance=getDistance(
            alert.location.lat,
            alert.location.lng,
            volunteer.location.lat,
            volunteer.location.lng
    );

    if (distance < minDistance) {
      minDistance = distance;
      bestVolunteer = volunteer;
    }
  });

  return bestVolunteer;
}
function getTopEmergencies(alerts, volunteerLocation) {
  return sortAlerts(alerts, volunteerLocation).slice(0, 3);
}

// ================= ADD ALERT =================
async function addAlert(lat, lng, severity) {
  try {
    const docRef = await addDoc(collection(db, "alerts"), {
      location: { lat, lng },
      severity,
      timestamp: new Date(),
      status: "pending"
    });

    console.log("Alert added:", docRef.id);
  } catch (err) {
    console.error(err);
  }
}

// ================= REAL-TIME + PRIORITY =================
function listenToAlerts() {
onSnapshot(collection(db, "alerts"), (snapshot) => {
let alerts = [];

const volunteerLocation = {
  lat: 21.25,
  lng: 81.63
};

snapshot.forEach((docSnap) => {
  const data = docSnap.data();

  const priorityScore =
    calculatePriority(data, volunteerLocation);

  alerts.push({
    id: docSnap.id,
    ...data,
    priorityScore,
    priorityLevel:
      getPriorityLevel(priorityScore)
  });
});

alerts =
  sortAlerts(alerts, volunteerLocation);

console.log("SMART ALERTS:", alerts);

});
}

// ================= ASSIGN VOLUNTEER =================
async function assignVolunteer(alertId, volunteerId) {
  try {
    await updateDoc(doc(db, "alerts", alertId), {
      status: "assigned",
      assignedVolunteer: volunteerId
    });

    await updateDoc(doc(db, "volunteers", volunteerId), {
      available: false,
      assignedAlert: alertId
    });

    console.log("Volunteer assigned");
  } catch (err) {
    console.error(err);
  }
}

// ================= AUTO ASSIGN =================
async function autoAssignVolunteer() {
  const alertsSnap = await getDocs(collection(db, "alerts"));
  const volunteersSnap = await getDocs(collection(db, "volunteers"));

  let alerts = [];
  let volunteers = [];

  alertsSnap.forEach(d => {
    const data = d.data();
    if (data.status === "pending") {
      alerts.push({ id: d.id, ...data });
    }
  });

  volunteersSnap.forEach(d => {
    const data = d.data();
    if (data.available) {
      volunteers.push({ id: d.id, ...data });
    }
  });

  if (!alerts.length || !volunteers.length) return;

  const volunteerLocation = {
lat: 21.25,
lng: 81.63
};

alerts =
sortAlerts(alerts, volunteerLocation);

const topAlert = alerts[0];

const bestVolunteer =
findNearestVolunteer(topAlert, volunteers);

if (bestVolunteer) {
await assignVolunteer(
topAlert.id,
bestVolunteer.id
);
}
}

// ================= COMPLETE ALERT =================
async function completeAlert(alertId, volunteerId) {
  try {
    await updateDoc(doc(db, "alerts", alertId), {
      status: "completed"
    });

    await updateDoc(doc(db, "volunteers", volunteerId), {
      available: true,
      assignedAlert: null
    });

    console.log("Alert completed");
  } catch (err) {
    console.error(err);
  }
}

// ================= START SYSTEM =================
listenToAlerts();

// OPTIONAL TEST
// addAlert(21.25, 81.63, 4);
