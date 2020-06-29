/* Imprecise German Word Clock by fschwic
A remix of Imprecise Word Clock by A. Blanton
A remix of word clock
by Gordon Williams https://github.com/gfwilliams
- Words in german
*/
/* jshint esversion: 6 */

const allWords = [
  "OFRÜHERK",
  "FRAJADXM",
  "SPÄTERIO",
  "MITTERÖR",
  "BINSDERG",
  "VABENDTE",
  "ONACHTRN",
  "RAMITTAG",
];

const timeOfDay = {
  0: ["", 0, 0],
  1: ["FRÜHERMORGEN", 10, 20, 30, 40, 50, 60, 71, 72, 73, 74, 75, 76],
  2: ["MORGEN", 71, 72, 73, 74, 75, 76],
  3: ["VORMITTAG", 05, 06, 07, 27, 37, 47, 57, 67, 77],
  4: ["MITTAG", 27, 37, 47, 57, 67, 77],
  5: ["FRÜHERNACHMITTAG", 10, 20, 30, 40, 50, 60, 16, 26, 36, 46, 27, 37, 47, 57, 67, 77],
  6: ["NACHMITTAG", 16, 26, 36, 46, 27, 37, 47, 57, 67, 77],
  7: ["SPÄTERNACHMITTAG", 02, 12, 22, 32, 42, 52, 16, 26, 36, 46, 27, 37, 47, 57, 67, 77],
  8: ["FRÜHERABEND", 10, 20, 30, 40, 50, 60, 15, 25, 35, 45, 55],
  9: ["ABEND", 15, 25, 35, 45, 55],
  10: ["NACHT", 16, 26, 36, 46, 56],
  11: ["MITTERNACHT", 03, 13, 23, 33, 43, 53, 16, 26, 36, 46, 56],
  12: ["SPÄTINDERNACHT", 02, 12, 22, 32, 14, 24, 44, 54, 64, 16, 26, 36, 46, 56],
};


// offsets and increments
const xs = 35;
const ys = 31;
const dy = 22;
const dx = 25;

// font size and color
const fontSize = 3; // "6x8"
const passivColor = 0x3186 /*grey*/ ;
const activeColorNight = "#33BB33" /*green*/ ;
const activeColorDay = 0xFFFF /* white */ ;

var hidxPrev;

function drawWordClock() {


  // get time
  var t = new Date();
  var h = t.getHours();
  var m = t.getMinutes();
  var time = ("0" + h).substr(-2) + ":" + ("0" + m).substr(-2);
  var day = t.getDay();

  var hidx;

  var activeColor = activeColorDay;
  if (h < 7 || h > 19) {
    activeColor = activeColorNight;
  }

  g.setFont("6x8", fontSize);
  g.setColor(passivColor);
  g.setFontAlign(0, -1, 0);


  // Switch case isn't good for this in Js apparently so...
  if (h < 1) {
    // Middle of the Night
    hidx = 11;
  } else if (h < 3) {
    // Spät in der Nacht
    hidx = 12;
  } else if (h < 7) {
    // Early Morning
    hidx = 1;
  } else if (h < 10) {
    // Morning
    hidx = 2;
  } else if (h < 12) {
    // Vormittag
    hidx = 3;
  } else if (h < 13) {
    // Midday
    hidx = 4;
  } else if (h < 14) {
    // Early afternoon
    hidx = 5;
  } else if (h < 15) {
    // Afternoon
    hidx = 6;
  } else if (h < 17) {
    // Late Afternoon
    hidx = 7;
  } else if (h < 19) {
    // Early evening
    hidx = 8;
  } else if (h < 21) {
    // evening
    hidx = 9;
  } else if (h < 24) {
    // Night
    hidx = 10;
  }

  // check whether we need to redraw the watchface
  if (hidx !== hidxPrev) {
    // draw allWords
    var c;
    var y = ys;
    var x = xs;
    allWords.forEach((line) => {
      x = xs;
      for (c in line) {
        g.drawString(line[c], x, y);
        x += dx;
      }
      y += dy;
    });

    // write hour in active color
    g.setColor(activeColor);
    timeOfDay[hidx][0].split('').forEach((c, pos) => {
      x = xs + (timeOfDay[hidx][pos + 1] / 10 | 0) * dx;
      y = ys + (timeOfDay[hidx][pos + 1] % 10) * dy;
      g.drawString(c, x, y);
    });
    hidxPrev = hidx;
  }

  // Display digital time while button 1 is pressed
  g.clearRect(0, 215, 240, 240);
  if (BTN1.read()) {
    g.setColor(activeColor);
    g.drawString(time, 120, 215);
  }
}


Bangle.on('lcdPower', function(on) {
  if (on) drawWordClock();
});

g.clear();
Bangle.loadWidgets();
Bangle.drawWidgets();
setInterval(drawWordClock, 1E4);
drawWordClock();

// Show digital time while top button is pressed
setWatch(drawWordClock, BTN1, {
  repeat: true,
  edge: "both"
});

// Show launcher when middle button pressed
setWatch(Bangle.showLauncher, BTN2, {
  repeat: false,
  edge: "falling"
});
