var s = require("Storage");
var dex = s.readJSON("pokedex.json");

var selected = 0;
var menuScroll = 0;
var menuShowing = false;

function drawMenu() { // kopiert vom BangleJS default Launcher
  g.setFont("6x8", 2);
  g.setFontAlign(-1, 0);
  var n = 3; // zeige n Einträge

  if (selected >= n + menuScroll) menuScroll = 1 + selected - n; //
  if (selected < menuScroll) menuScroll = selected; // erster gezeigter ist ausgewählt

  if (menuScroll) { // wenn es oberhalb noch Einträge gibt
    g.fillPoly([120, 0, 100, 20, 140, 20]); // zeichne ein Dreieck "nach oben"
  } else {
    g.clearRect(100, 0, 140, 20); // sonst, entferne das Dreieck "nach oben"
  }

  if (dex.length > n + menuScroll) { // wenn es unterhalb noch Einträge gibt
    g.fillPoly([120, 239, 100, 219, 140, 219]); // zeichne ein Dreieckk "nach unten"
  } else {
    g.clearRect(100, 219, 140, 239); // sonst, entferne das Dreieck "nach unten"
  }

  for (var i = 0; i < n; i++) { // wir haben n Zeilen für Einträge; für jede Zeile ...
    var pokemon = dex[i + menuScroll];
    if (!pokemon) break;
    var y = 24 + i * 64;

    if (i + menuScroll == selected) {
      g.setColor(0.3, 0.3, 0.3);
      g.fillRect(0, y, 239, y + 63);
      g.setColor(1, 1, 1);
      g.drawRect(0, y, 239, y + 63);
    } else {
      g.clearRect(0, y, 239, y + 63);
    }

    g.drawString(pokemon.name, 64, y + 32); // Name schreiben

    var icon = undefined;
    if (pokemon.icon) icon = s.read(pokemon.icon);
    if (icon) try {
      g.drawImage(icon, 8, y + 8, {
        scale: 0.5
      }); // Icon zeichnen (falls vorhanden)
    } catch (e) {}
  }
}
drawMenu();

function drawPokemonScreen() {
  const IMAGE_SIZE = 96;
  const SCREEN_SIZE = 240;

  g.clear();
  var pokemon = dex[selected];
  var img = s.read(pokemon.icon);
  g.drawImage(img, SCREEN_SIZE - IMAGE_SIZE - 5, 10, {
    scale: 1
  });

  writeText(pokemon.name, IMAGE_SIZE, SCREEN_SIZE - IMAGE_SIZE - 5, IMAGE_SIZE + 10);
  writeText(pokemon.beschreibung, 130, 5, 10);
}

function writeText(text, size, width, offset_x, offset_y) {
  var linenumber = 0;
  var lines = [];

  g.setFont("6x8", 2);
  var line = "";
  var words = text.split(' ');
  words.forEach(function(word, i) {
    line += word;
    if (i > 0 && g.stringWidth(line) > width) {
      writeOut(lines, linenumber, size, offset_x, offset_y);
      line = word;
      linenumber++;
    }
    lines[linenumber] = line;
  });
  // write last unfilled line
  writeOut(lines, linenumber, offset_x, offset_y);
}

function writeOut(written, line_index, size, offset_x, offset_y) {
  g.setFont("6x8", size).drawString(written[line_index], offset_x, offset_y + ((size +1)*size) * line_index);
}

/******************************\
 * Knöpfe                     *
\******************************/
setWatch(function() {
  selected--;
  if (selected < 0) selected = dex.length - 1;
  drawMenu();
}, BTN1, {
  repeat: true
});

setWatch(drawPokemonScreen, BTN2, {
  repeat: true
});

setWatch(function() {
  selected++;
  if (selected >= dex.length) selected = 0;
  drawMenu();
}, BTN3, {
  repeat: true
});
