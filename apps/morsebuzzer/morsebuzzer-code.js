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
};
// QRA: My name is ...
// QRS: Send more slowly.
// QRT: Stop sending.

var keyer = Bangle.buzz; // keyer might be Bangle.buzz or Bangle.beep

var gatt;
NRF.requestDevice({
  filters: [{
    namePrefix: 'Bangle.js'
  }]
}).then(
  console.log("found");
  device => device.gatt.connect()
).then(
  console.log("connected");
  g => (gatt = g).getPrimaryService("6e400001-b5a3-f393-e0a9-e50e24dcca9e")
).then(
  console.log("got service");
  service => service.getCharacteristic("6e400002-b5a3-f393-e0a9-e50e24dcca9e")
).then(
  console.log("got cahracteristic");
  characteristic => characteristic.writeValue("Bangle.buzz(180)\n")
).then(
  console.log("send and disconnecting");
  () => {
    gatt.disconnect();
    console.log("Done!");
  }
);
