const WPM = 20;
const F_WPM = 20;
const UNIT = 20 * (60 / WPM);
const F_UNIT = 20 * (60 / F_WPM);
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
  133131: '@',
  13111: '&',
  331133: ',',
  131313: '.',
  133331: "'",
  313313: ')',
  31331: '(',
  333111: ':',
  31113: '=',
  313133: '!',
  311113: '-',
  13131: '+',
  131131: '"',
  113311: '?',
  31131: '/'
};
// QRA: My name is ...
// QRS: Send more slowly.
// QRT: Stop sending.

var keyer = Bangle.buzz; // keyer might be Bangle.buzz or Bangle.beep

var sign = ""; // the undergoing sequence of dits and dahs constituting a character
var waitForChar = ""; // timeout identifier for end of char
var waitForWord = ""; // timeout identifier for end of word
var ditWatcher;
var dahWatcher;

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
  var c = MORSE_MAP[sign];
  if (c) {
    //sendOut(sign);
    nextChar(c);
  } else {
    console.log("Unknown sign: " + sign);
  }
  sign = "";
};

const newWord = () => {
  nextChar(" ");
};

const listen = () => {
  waitForChar = setTimeout(newChar, F_UNIT * 3);
  waitForWord = setTimeout(newWord, F_UNIT * 7);
  ditWatcher = setWatch(dit, BTN4, {
    repeat: false
  });
  dahWatcher = setWatch(dah, BTN5, {
    repeat: false
  });
};

const unlisten = () => {
  clearWatch(ditWatcher);
  clearWatch(dahWatcher);
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
  ditWatcher = setWatch(dit, BTN4, {
    repeat: false
  });
  dahWatcher = setWatch(dah, BTN5, {
    repeat: false
  });
};
init();

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
  g.setFont("6x8", 3);
  if (g.stringWidth(written[linenumber]) > 220) {
    linenumber++;
    written[linenumber] = "";
  }
  written[linenumber] += c;
  writeOut(written, linenumber, 10, 26);
}

function sendOut(sign) {
  var signal_array = sign.split("");

  function it(signals) {
    console.log(signals[0]);
    Bangle.buzz(Number(signals[0]) * UNIT).then(function() {
      setTimeout(() => {}, UNIT);
    }).then(function() {
      signals.shift();
      if (signals.length > 0) {
        it(signals);
      }
    });
  }
  it(signal_array);
}

function writeOut(written, line_index, offset_x, offset_y) {
  g.setFont("6x8", 3).drawString(written[line_index], offset_x, offset_y + 26 * line_index);
}
