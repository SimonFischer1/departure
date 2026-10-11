/* HIER änderst du Orte, Daten und Texte – die anderen Dateien musst du nie anfassen.
   Datumsformat: "JJJJ-MM-TT". Stationen dürfen in beliebiger Reihenfolge stehen.
   Ankunftsort: bei der letzten Station unter "ort" eintragen. */
window.REISE={
  seitenTitel:"Departure — Simon", schiff:"Cuno Essberger",
  titel:"Next stop: New horizons.",
  untertitel:"Von Rotterdam aufs Schiff. Tag für Tag näher zurück nach Hause.",
  bildAlt:"Das Schiff auf dem Meer",
  zaehlerText:"Tage bis zur Ankunft", vorStart:"Die Reise beginnt bald.",
  /* icon: flug | schiff | flagge | punkt */
  stops:[
   {datum:"2026-09-03",kurz:"Abreise",icon:"flug",titel:"Abreise nach Rotterdam",text:"Du startest deine Reise und machst dich auf den Weg nach Rotterdam.",ort:"Rotterdam, Niederlande",badge:"Start",status:"Auf dem Weg nach Rotterdam."},
   {datum:"2026-09-05",kurz:"Boarding",icon:"schiff",titel:"Auf das Schiff steigen",text:"Du gehst an Bord. Das Abenteuer auf See beginnt.",ort:"Rotterdam, Niederlande",badge:"Boarding",status:"Aktuell auf See."},
   {datum:"2026-12-04",kurz:"Ankunft",icon:"flagge",titel:"Von Bord gehen",text:"Voraussichtlich endet die Schiffsreise heute.",ort:"Zielhafen · noch offen",badge:"Voraussichtlich",heute:"Heute voraussichtlich von Bord.",status:"Die Reise ist abgeschlossen."}
  ]
};