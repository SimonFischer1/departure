// Alles zum Anpassen steht hier – die Seite passt sich automatisch an.
const CONFIG = {
  eventTitle: "Simon kommt nach Hause ❤️",
  eventLocation: "Airport Bremen",
  appleMapsLink: "https://maps.apple.com/?q=Airport+Bremen",
  eventNote: "Endlich wieder zusammen ❤️",

  departureDate: "2026-09-03",  // Bremen → Rotterdam
  boardingDate:  "2026-09-05",  // an Bord in Rotterdam
  offBoardDate:  "2027-09-04",  // von Bord, Flug nach Bremen (Jahr ggf. anpassen)
  arrivalTime:   "18:30",       // Ankunft Airport Bremen

  milestones: [
    { date: "2026-09-03", title: "Abreise",  place: "Bremen → Rotterdam" },
    { date: "2026-09-05", title: "An Bord",  place: "Rotterdam" },
    { date: "2027-09-04", title: "Heimflug", place: "Rotterdam → Bremen" }
  ],

  // Ablauf am Tag der Heimreise
  homeDay: [
    { time: "09:00", title: "Von Bord gehen",   place: "Rotterdam",      note: "Letzter Blick aufs Schiff." },
    { time: "10:30", title: "Fahrt zum Flughafen", place: "Rotterdam",   note: "Gepäck verstaut, es geht los." },
    { time: "12:00", title: "Abflug",           place: "Rotterdam → Bremen", note: "Der Flug nach Hause." },
    { time: "18:30", title: "Ankunft",          place: "Airport Bremen", note: "Endlich wieder zusammen." }
  ]
};
