/* ════════════════════════════════════════════════════════════════════
   CONFIG – HIER ÄNDERST DU ALLES. Die anderen Dateien nie anfassen.

   So geht's: Nur den Text zwischen den "Anführungszeichen" ändern.
   Kommas, Klammern und Doppelpunkte immer stehen lassen.
   Zeilen mit  ◄  sind die, die du am häufigsten brauchst.

   Übersicht:
     1. FLUG         Flugnummer, Abflug, Ankunft, Verspätung, Status
     2. STATIONEN    Reise-Termine (Abreise, Boarding, Von Bord)
     3. TEXTE        Überschriften und Sprüche auf der Seite
     4. BLINKEN      Tempo des Signals
   ════════════════════════════════════════════════════════════════════ */
window.REISE={


/* ╔══════════════════════════════════════════════════════════════════╗
   ║  1. FLUG                                                         ║
   ║  Die Flugansicht erscheint automatisch, wenn der Abflug in       ║
   ║  weniger als 24 Stunden ist. Solange "abflug" leer ist, bleibt   ║
   ║  sie aus.                                                        ║
   ╚══════════════════════════════════════════════════════════════════╝ */
flug:{

  nummer:   "",                      // ◄ Flugnummer, z. B. "LH 1234"

  /* Zeiten immer mit Zeitzone am Ende:
     Deutschland im Winter = +01:00, im Sommer = +02:00, Manila = +08:00
     Format: JJJJ-MM-TT T HH:MM:00 +Zeitzone                              */
  abflug:   "",                      // ◄ z. B. "2026-12-04T12:00:00+01:00"
  ankunft:  "",                      // ◄ z. B. "2026-12-04T13:10:00+01:00"

  /* Abflug-Flughafen */
  von:{
    code:   "",                      // ◄ Kürzel, z. B. "FRA"
    ort:    "",                      // ◄ Stadt, z. B. "Frankfurt"
    zone:   "Europe/Berlin"          //   Zeitzone, z. B. "Asia/Manila"
  },

  /* Ziel-Flughafen */
  nach:{
    code:   "BRE",                   // ◄ Kürzel
    ort:    "Bremen",                // ◄ Stadt
    zone:   "Europe/Berlin"          //   Zeitzone
  },

  verspaetung: 0,                    // ◄ Verspätung in Minuten, z. B. 25 (Abflug und Ankunft rutschen mit)

  /* Status: leer lassen = läuft automatisch nach Uhrzeit.
     Nur zum Überschreiben von Hand, dann eines davon eintragen:
       "airport"  am Flughafen        "takeoff"  hebt ab
       "flight"   in der Luft         "landing"  Landeanflug
       "arrived"  gelandet                                                */
  phase:    "",                      // ◄ meistens leer

  vorlaufStunden: 24                 //   Ab wie vielen Stunden vor Abflug die Flugansicht startet
},


/* ╔══════════════════════════════════════════════════════════════════╗
   ║  2. STATIONEN (Reise-Termine)                                    ║
   ║  Datum immer so: "JJJJ-MM-TT". Reihenfolge ist egal.            ║
   ║  Das erste und das letzte Datum steuern auch das Widget auf      ║
   ║  dem iPhone (Start und Ankunft). Icon: flug, schiff, flagge,     ║
   ║  punkt.                                                          ║
   ╚══════════════════════════════════════════════════════════════════╝ */
stops:[

  /* ── Station 1: Abreise ── */
  {
    datum:  "2026-09-03",            // ◄ Datum
    kurz:   "Abreise",               //   Kurzname auf dem Zeitstrahl
    icon:   "flug",
    titel:  "Abreise nach Rotterdam",
    text:   "Du startest deine Reise und machst dich auf den Weg nach Rotterdam.",
    ort:    "Rotterdam, Niederlande",// ◄ Ort
    badge:  "Start",
    status: "Auf dem Weg nach Rotterdam."
  },

  /* ── Station 2: Boarding ── */
  {
    datum:  "2026-09-05",            // ◄ Datum
    kurz:   "Boarding",
    icon:   "schiff",
    titel:  "Auf das Schiff steigen",
    text:   "Du gehst an Bord. Das Abenteuer auf See beginnt.",
    ort:    "Rotterdam, Niederlande",// ◄ Ort
    badge:  "Boarding",
    status: "Aktuell auf See."
  },

  /* ── Station 3: Liegezeit Brofjorden (mögliches Von-Bord-Gehen) ── */
  {
    datum:  "2026-12-05",            // ◄ Datum (Liegezeit 05.12. bis 06.12.)
    kurz:   "Brofjorden",
    icon:   "punkt",
    titel:  "Liegezeit Brofjorden",
    text:   "Das Schiff liegt vom 05.12. bis 06.12. in Brofjorden. Hier kann er von Bord gehen.",
    ort:    "Brofjorden, Schweden · Liegezeit 05.12.–06.12.",// ◄ Ort
    badge:  "Möglich",
    heute:  "Heute liegt das Schiff in Brofjorden.",
    status: "Liegt in Brofjorden, Von-Bord-Gehen möglich."
  },

  /* ── Station 4: Liegezeit Helsingborg (mögliches Von-Bord-Gehen) ── */
  {
    datum:  "2026-12-06",            // ◄ Datum (Liegezeit 06.12. bis 07.12.)
    kurz:   "Helsingborg",
    icon:   "punkt",
    titel:  "Liegezeit Helsingborg",
    text:   "Das Schiff liegt vom 06.12. bis 07.12. in Helsingborg. Auch hier kann er von Bord gehen.",
    ort:    "Helsingborg, Schweden · Liegezeit 06.12.–07.12.",// ◄ Ort
    badge:  "Möglich",
    heute:  "Heute liegt das Schiff in Helsingborg.",
    status: "Liegt in Helsingborg, Von-Bord-Gehen möglich."
  },

  /* ── Station 5: Zuhause in Elsfleth (= Ankunft, bestimmt den Tage-Zähler und das Widget) ── */
  {
    datum:  "2026-12-07",            // ◄ Tag der Ankunft in Elsfleth, sobald klar ist, in welchem Hafen er geht
    kurz:   "Elsfleth",
    icon:   "flagge",
    titel:  "Zurück in Elsfleth",
    text:   "Nach dem Von-Bord-Gehen geht es heim nach Elsfleth. Der genaue Tag steht fest, sobald der Hafen klar ist.",
    ort:    "Elsfleth, Deutschland",// ◄ Ort
    badge:  "Voraussichtlich",
    heute:  "Heute kommt er in Elsfleth an.",
    status: "Er ist zurück in Elsfleth."
  }

  /* Weitere Station? Block oben kopieren, Komma hinter die vorige } setzen. */
],


/* ╔══════════════════════════════════════════════════════════════════╗
   ║  3. TEXTE AUF DER SEITE                                          ║
   ╚══════════════════════════════════════════════════════════════════╝ */
schiff:        "Cuno Essberger",     // ◄ Schiffsname (steht auch im Widget unten)
seitenTitel:   "Departure — Simon",  //   Titel im Browser-Tab
titel:         "Simon kommt nach Hause.",
untertitel:    "Je näher er kommt, desto schneller blinkt das Signal.",
zaehlerText:   "Tage bis zur Ankunft",
zaehlerTextEin:"Tag bis zur Ankunft",
vorStart:      "Die Reise beginnt bald.",
angekommen:    "Er ist da.",

/* Statussprüche unter dem Zähler. "ab" = Anteil der Reise, der noch vor ihm liegt
   (1 = ganz weit weg, 0 = da). */
signal:[
  {ab:0.75, text:"Signal schwach. Er ist noch weit draußen."},
  {ab:0.45, text:"Das Signal wird stärker."},
  {ab:0.2,  text:"Er kommt näher."},
  {ab:0,    text:"Fast da. Das Blinken wird hektisch."}
],


/* ╔══════════════════════════════════════════════════════════════════╗
   ║  4. BLINKEN                                                      ║
   ╚══════════════════════════════════════════════════════════════════╝ */
blinkLangsam: 2.8,                   // ◄ Sekunden pro Blinken, wenn er weit weg ist
blinkSchnell: 0.34,                  // ◄ Sekunden pro Blinken kurz vor Ankunft (nicht unter 0.34)
bild:         ""                     //   Eigenes Pixelbild (PNG), z. B. "pic/sprite.png". Leer = eingebaute Maske

};
