/* HIER änderst du Orte, Daten und Texte – die anderen Dateien musst du nie anfassen.
   Datumsformat: "JJJJ-MM-TT". Stationen dürfen in beliebiger Reihenfolge stehen.
   Ankunftsort: bei der letzten Station unter "ort" eintragen. */
window.REISE={
  seitenTitel:"Departure — Simon", schiff:"Cuno Essberger",
  titel:"Simon kommt nach Hause.",
  untertitel:"Je näher er kommt, desto schneller blinkt das Signal.",
  zaehlerText:"Tage bis zur Ankunft", zaehlerTextEin:"Tag bis zur Ankunft",
  vorStart:"Die Reise beginnt bald.", angekommen:"Er ist da.",
  /* Blink-Takt in Sekunden pro Blinken: weit weg = langsam, kurz vor Ankunft = schnell.
     Nicht unter 0.34 gehen (mehr als 3 Blitze pro Sekunde sind unangenehm). */
  blinkLangsam:2.8, blinkSchnell:0.34,
  /* Optional: eigenes Pixelbild (PNG) statt der eingebauten Maske, z. B. "pic/sprite.png" */
  bild:"",
  /* Statustexte nach Nähe. "ab" = Anteil der Reise, der noch vor ihm liegt (1 = ganz weit weg). */
  signal:[
   {ab:0.75,text:"Signal schwach. Er ist noch weit draußen."},
   {ab:0.45,text:"Das Signal wird stärker."},
   {ab:0.2,text:"Er kommt näher."},
   {ab:0,text:"Fast da. Das Blinken wird hektisch."}
  ],
  /* icon: flug | schiff | flagge | punkt */
  stops:[
   {datum:"2026-09-03",kurz:"Abreise",icon:"flug",titel:"Abreise nach Rotterdam",text:"Du startest deine Reise und machst dich auf den Weg nach Rotterdam.",ort:"Rotterdam, Niederlande",badge:"Start",status:"Auf dem Weg nach Rotterdam."},
   {datum:"2026-09-05",kurz:"Boarding",icon:"schiff",titel:"Auf das Schiff steigen",text:"Du gehst an Bord. Das Abenteuer auf See beginnt.",ort:"Rotterdam, Niederlande",badge:"Boarding",status:"Aktuell auf See."},
   {datum:"2026-12-04",kurz:"Ankunft",icon:"flagge",titel:"Von Bord gehen",text:"Voraussichtlich endet die Schiffsreise heute.",ort:"Zielhafen · noch offen",badge:"Voraussichtlich",heute:"Heute voraussichtlich von Bord.",status:"Die Reise ist abgeschlossen."}
  ]
};
