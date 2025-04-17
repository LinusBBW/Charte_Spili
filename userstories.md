# Blackjack Game - User Stories

## Core Gameplay

### US-01: Starting a New Game
**Als** Spieler  
**Möchte ich** ein neues Blackjack-Spiel starten können  
**Damit** ich mit dem Spielen beginnen kann

**Akzeptanzkriterien:**
- Ein "Deal Cards"-Button ist auf dem Startbildschirm sichtbar
- Nach dem Klicken werden 2 Karten an mich und 2 Karten an den Dealer ausgeteilt
- Eine der Dealer-Karten ist verdeckt

### US-02: Karten Ziehen (Hit)
**Als** Spieler  
**Möchte ich** weitere Karten zu meiner Hand hinzufügen können  
**Damit** ich meinen Kartenwert verbessern kann

**Akzeptanzkriterien:**
- Ein "Hit"-Button ist während meines Zuges verfügbar
- Nach dem Klicken wird eine zusätzliche Karte zu meiner Hand hinzugefügt
- Der Gesamtwert meiner Hand wird aktualisiert
- Wenn mein Handwert 21 überschreitet, verliere ich automatisch (Bust)

### US-03: Stehenbleiben (Stand)
**Als** Spieler  
**Möchte ich** meinen Zug beenden können, ohne weitere Karten zu ziehen  
**Damit** ich meinen aktuellen Handwert behalten kann

**Akzeptanzkriterien:**
- Ein "Stand"-Button ist während meines Zuges verfügbar
- Nach dem Klicken ist mein Zug beendet und der Dealer beginnt seinen Zug
- Meine Karten und deren Gesamtwert bleiben unverändert

### US-04: Dealer-Automatik
**Als** Spieler  
**Möchte ich,** dass der Dealer nach festgelegten Regeln spielt  
**Damit** das Spiel fair und regelkonform abläuft

**Akzeptanzkriterien:**
- Der Dealer deckt seine verdeckte Karte auf, nachdem ich "Stand" gewählt habe
- Der Dealer zieht automatisch Karten, bis sein Handwert mindestens 17 beträgt
- Wenn der Dealer über 21 geht (Bust), gewinne ich automatisch

### US-05: Spielergebnis anzeigen
**Als** Spieler  
**Möchte ich** am Ende einer Runde das Ergebnis sehen  
**Damit** ich weiß, ob ich gewonnen oder verloren habe

**Akzeptanzkriterien:**
- Nach Abschluss einer Runde wird das Ergebnis deutlich angezeigt (Gewinn/Verlust/Unentschieden)
- Der Grund für das Ergebnis ist klar ersichtlich (z.B. "Dealer busts" oder "Your hand: 19, Dealer's hand: 17")
- Ein "New Game"-Button ermöglicht es mir, eine neue Runde zu beginnen

## Erweiterte Funktionen

### US-06: Spielstatistik verfolgen
**Als** Spieler  
**Möchte ich** meine Spielstatistiken sehen  
**Damit** ich meinen Fortschritt verfolgen kann

**Akzeptanzkriterien:**
- Anzeige meiner Siege, Niederlagen und Unentschieden
- Die Statistiken bleiben auch nach dem Neuladen der Seite erhalten

### US-07: Einsätze platzieren
**Als** Spieler  
**Möchte ich** vor jeder Runde einen Einsatz platzieren können  
**Damit** das Spiel spannender wird

**Akzeptanzkriterien:**
- Vor Beginn jeder Runde kann ich einen Einsatzbetrag wählen
- Mein aktuelles Guthaben wird angezeigt und aktualisiert sich nach jeder Runde
- Bei einem Gewinn erhalte ich meinen Einsatz verdoppelt zurück
- Bei einem Blackjack (21 mit den ersten beiden Karten) erhalte ich den 1,5-fachen Einsatz

### US-08: Verdoppeln (Double Down)
**Als** Spieler  
**Möchte ich** meinen Einsatz verdoppeln können  
**Damit** ich bei guten Karten höhere Gewinne erzielen kann

**Akzeptanzkriterien:**
- Die Option "Double Down" ist verfügbar, wenn ich nur 2 Karten habe
- Nach dem Verdoppeln wird genau eine weitere Karte ausgeteilt
- Mein Einsatz wird verdoppelt
- Mein Zug endet automatisch nach dem Verdoppeln

### US-09: Spielregeln einsehen
**Als** Spieler  
**Möchte ich** die Regeln des Spiels einsehen können  
**Damit** ich verstehe, wie man spielt

**Akzeptanzkriterien:**
- Ein Button oder Link zu den Spielregeln ist leicht zugänglich
- Die Regeln werden klar und verständlich erklärt
- Die Regeln enthalten Informationen zu Kartenwerten, Spielablauf und Gewinnbedingungen

## Visuelle und Interaktive Aspekte

### US-10: Ansprechendes Spieldesign
**Als** Spieler  
**Möchte ich** ein visuell ansprechendes Spieldesign  
**Damit** das Spielerlebnis verbessert wird

**Akzeptanzkriterien:**
- Das Spiel hat ein grüner Spieltisch als Hintergrund
- Karten werden realistisch dargestellt
- Animations- und Soundeffekte verbessern das Spielerlebnis

### US-11: Responsive Design
**Als** Spieler  
**Möchte ich** das Spiel auf verschiedenen Geräten spielen können  
**Damit** ich flexibel spielen kann

**Akzeptanzkriterien:**
- Das Spiel passt sich verschiedenen Bildschirmgrößen an
- Die Bedienelemente sind auf Touchscreens leicht bedienbar
- Das Spielerlebnis bleibt auf allen Geräten konsistent

### US-12: Visuelles Feedback
**Als** Spieler  
**Möchte ich** visuelles Feedback zu meinen Aktionen bekommen  
**Damit** ich den Spielstatus besser verstehen kann

**Akzeptanzkriterien:**
- Buttons ändern ihr Aussehen, wenn sie angeklickt werden
- Spezielle Animationen für Gewinne, Verluste und Unentschieden
- Farbcodierung für verschiedene Spielergebnisse