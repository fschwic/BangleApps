var keyer = Bangle.buzz;

const dit = () => {
  keyer(60, 1550);
};
const dah = () => {
  keyer(180, 1550);
};
setWatch(dit, BTN4, { repeat: true });
setWatch(dah, BTN5, { repeat: true });

setWatch(() => keyer = Bangle.buzz, BTN1, { repeat: true });
setWatch(() => keyer = Bangle.beep, BTN3, { repeat: true });
