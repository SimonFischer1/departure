// Alles Wichtige zum Anpassen steht hier – die Seite passt sich automatisch an.
const CONFIG = {
  eventTitle: "Simon kommt nach Hause ❤️",
  eventLocation: "Airport Bremen",
  appleMapsLink: "https://maps.apple.com/?q=Airport+Bremen",
  eventNote: "Endlich wieder zusammen ❤️",

  departureDate: "2026-09-03",   // losgefahren
  boardingDate:  "2026-09-05",   // an Bord gegangen
  offBoardDate:  "2027-09-04",   // von Bord / Heimreise (Jahr ggf. anpassen)
  arrivalTime:   "18:30",        // Ankunft in Bremen

  milestones: [
    { date: "2026-09-03", title: "Abreise" },
    { date: "2026-09-05", title: "An Bord" },
    { date: "2027-09-04", title: "Heimreise" }
  ],

  // Ablauf am Tag der Heimreise – Uhrzeiten, Orte und Texte hier eintragen
  homeDay: [
    { time: "09:00", title: "Von Bord gehen",     place: "Hafen",                note: "Letzter Blick aufs Schiff." },
    { time: "10:30", title: "Fahrt zum Flughafen", place: "Transfer",             note: "Gepäck verstaut, es geht los." },
    { time: "12:00", title: "Abflug",              place: "Flughafen",            note: "Der Flug nach Hause beginnt." },
    { time: "18:30", title: "Landung & Wiedersehen", place: "Airport Bremen",     note: "Endlich wieder zusammen." }
  ]
};
