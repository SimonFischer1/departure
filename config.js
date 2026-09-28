// Alles zum Anpassen steht hier – die Seite passt sich automatisch an.
const ARRIVAL = "2026-12-04";  // Von-Bord-Tag = Ankunftstag in Bremen (JJJJ-MM-TT)

const CONFIG = {
  eventTitle: "Simon kommt nach Hause ❤️",
  eventLocation: "Airport Bremen",
  appleMapsLink: "https://maps.apple.com/?q=Airport+Bremen",
  eventNote: "Endlich wieder zusammen ❤️",

  startDate:    "2026-09-03",   // Abreise (für den Fortschrittsbalken)
  boardingDate: "2026-09-05",   // an Bord (für „Tag X an Bord“)
  arrivalDate:  ARRIVAL,        // Tag der Heimreise – NUR HIER ändern, alles andere passt sich an
  arrivalTime:  "18:30",        // Ankunft Airport Bremen

  // Timeline: Uhrzeit ist optional
  timeline: [
    { date: "2026-09-03",                  title: "Abreise",            place: "Bremen → Rotterdam",  note: "Der Abschied – und los geht’s." },
    { date: "2026-09-05",                  title: "An Bord",            place: "Rotterdam",           note: "Das Praxissemester beginnt." },
    { date: ARRIVAL, time: "09:00",    title: "Von Bord gehen",     place: "Rotterdam",           note: "Letzter Blick aufs Schiff." },
    { date: ARRIVAL, time: "10:30",    title: "Fahrt zum Flughafen", place: "Rotterdam",          note: "Gepäck verstaut, es geht los." },
    { date: ARRIVAL, time: "12:00",    title: "Abflug",             place: "Rotterdam → Bremen",  note: "Der Flug nach Hause." },
    { date: ARRIVAL, time: "18:30",    title: "Ankunft",            place: "Airport Bremen",      note: "Endlich wieder zusammen.", final: true }
  ]
};
