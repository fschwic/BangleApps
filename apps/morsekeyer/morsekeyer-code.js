const WPM = 20;
const UNIT = 20 * (60 / WPM);
const MORSE_MAP = {
  13: 'A',
  3111: 'B',
  3131: 'C',
  311: 'D',
  1: 'E',
  1131: 'F',
  331: 'G',
  1111: 'H',
  11: 'I',
  1333: 'J',
  313: 'K',
  1311: 'L',
  33: 'M',
  31: 'N',
  333: 'O',
  1331: 'P',
  3313: 'Q',
  131: 'R',
  111: 'S',
  3: 'T',
  113: 'U',
  1113: 'V',
  133: 'W',
  3113: 'X',
  3133: 'Y',
  3311: 'Z',
  13333: '1',
  11333: '2',
  11133: '3',
  11113: '4',
  11111: '5',
  31111: '6',
  33111: '7',
  33311: '8',
  33331: '9',
  33333: '0',
};
// QRA: My name is ...
// QRS: Send more slowly.
// QRT: Stop sending.

var keyer = Bangle.buzz; // keyer might be Bangle.buzz or Bangle.beep

var sign = ""; // the undergoing sequence of dits and dahs constituting a character
var waitForChar = ""; // timeout identifier for end of char
var waitForWord = ""; // timeout identifier for end of word

var linenumber; // current number of lines of written text
var written; // what was written so far, an array of lines

const dit = () => {
  unlisten();
  keyer(UNIT, 1550).then(() => {
    sign += "1";
    listen();
  });
};

const dah = () => {
  unlisten();
  keyer(UNIT * 3, 1550).then(() => {
    sign += "3";
    listen();
  });
};

const newChar = () => {
  nextChar(MORSE_MAP[sign]);
  sign = "";
};

const newWord = () => {
  nextChar(" ");
};

const listen = () => {
  waitForChar = setTimeout(newChar, UNIT * 3);
  waitForWord = setTimeout(newWord, UNIT * 7);
};

const unlisten = () => {
  clearTimeout(waitForChar);
  clearTimeout(waitForWord);
};


const init = () => {
  linenumber = 0;
  written = [];
  written[linenumber] = "";

  g.clear();
  g.drawLine(120, 0, 120, 240);
  g.fillCircle(60, 120, 10);
  g.fillRect(160, 110, 200, 130);
  g.fillCircle(160, 120, 10);
  g.fillCircle(200, 120, 10);
  //Bangle.loadWidgets();
  //Bangle.drawWidgets();
};
init();

setWatch(dit, BTN4, {
  repeat: true
});
setWatch(dah, BTN5, {
  repeat: true
});

setWatch(() => keyer = Bangle.buzz, BTN1, {
  repeat: true
});
setWatch(init, BTN2, {
  repeat: true
});
setWatch(() => keyer = Bangle.beep, BTN3, {
  repeat: true
});

function nextChar(c) {
  if (g.stringWidth(written[linenumber]) > 220) {
    linenumber++;
    written[linenumber] = "";
  }
  written[linenumber] += c;
  writeOut(written, linenumber);
}

function writeOut(written, linenumber) {
  g.setFont("6x8", 3).drawString(written[linenumber], 10, 26 * (linenumber + 1));
}
