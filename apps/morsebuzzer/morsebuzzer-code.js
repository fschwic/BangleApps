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

var gatt;
NRF.requestDevice({
  filters: [{
    namePrefix: 'Bangle.js'
  }]
}).then(
  device => device.gatt.connect()
).then(
  g => (gatt = g).getPrimaryService("6e400001-b5a3-f393-e0a9-e50e24dcca9e")
).then(
  service => service.getCharacteristic("6e400002-b5a3-f393-e0a9-e50e24dcca9e")
).then(
  characteristic => characteristic.writeValue("function sendOut(sign){var signal_array = sign.split(\"\");function it(signals) {console.log(signals[0]);Bangle.buzz(Number(signals[0]) * UNIT).then(function() {setTimeout(() => {}, UNIT);}).then(function() {signals.shift();if (signals.length > 0) {it(signals);}});}; sendOut(\"1333\")\n")
).then(
  () => {
    gatt.disconnect();
    console.log("Done!");
  }
).catch(
  () => {
    gatt.disconnect();
    console.log("catched and disconnected");
  }
);
