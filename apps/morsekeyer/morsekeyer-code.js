g.clear();
g.drawLine(120, 0, 120, 240);
g.fillCircle(60, 120, 10);
g.fillRect(160, 110, 200, 130);
g.fillCircle(160, 120, 10);
g.fillCircle(200, 120, 10);

const WPM = 20;
const UNIT = 20*(60/WPM);
var keyer = Bangle.buzz;

const dit = () => {
  keyer(UNIT, 1550);
};
const dah = () => {
  keyer(UNIT*3, 1550);
};
setWatch(dit, BTN4, { repeat: true });
setWatch(dah, BTN5, { repeat: true });

setWatch(() => keyer = Bangle.buzz, BTN1, { repeat: true });
setWatch(() => keyer = Bangle.beep, BTN3, { repeat: true });
