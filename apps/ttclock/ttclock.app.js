var s = require("Storage");
var SP = s.readJSON("ttclock-timetable.json");

function makeDate(date, timestring) {
  const collonPosition = timestring.indexOf(":");
  const hours = timestring.substring(0, collonPosition);
  const minutes = timestring.substring(collonPosition + 1);
  var result = new Date(date.getTime());
  result.setHours(hours);
  result.setMinutes(minutes);
  result.setSeconds(0);
  return result;
}

const getDayPlan = function(date) {
  const weekDayNum = date.getDay();
  var result;
  SP.forEach(function(e) {
    if (e.day === weekDayNum) {
      result = e;
    }
  });
  return result;
};

require("Font7x11Numeric7Seg").add(Graphics);

let locale = require('locale'); {
  let date = new Date();
  date.setFullYear(1111);
  date.setMonth(1, 3); // februari: months are zero-indexed
  const localizedDateString = locale.date(date, true);
  locale.dayFirst = /3.*2/.test(localizedDateString);
  // we do not support am/pm (yet)
  //locale.hasMeridian = false
  //if(typeof locale.meridian === 'function') {  // function does not exists if languages  app is not installed
  //locale.hasMeridian = (locale.meridian(date) !== '')
  //}
}

const screen = {
  width: g.getWidth(),
  height: g.getWidth(),
  middle: g.getWidth() / 2,
  center: g.getHeight() / 2,
};

// hardcoded "settings"
var settings = {};
settings.gap = 10;
settings.day = {
  color: -1,
  font: 'Vector',
  size: 20,
  middle: 24 + 20 / 2 + 2,
  center: screen.center,
  margin: 2
};
settings.time = {
  color: -1,
  font: '7x11Numeric7Seg',
  size: 7,
  middle: 24 + settings.day.size + 2 * settings.day.margin + 77 / 2 + 4, //screen.middle - 20,
  center: screen.center,
  margin: 4
};
settings.weekday = {
  color: -1,
  font: 'Vector',
  size: 18,
  middle: 24 + settings.day.size + 2 * settings.day.margin + settings.time.size * 11 + 2 * settings.time.margin + settings.gap + 18 / 2 + 2, //screen.height - 80,
  center: screen.center,
  margin: 2
};
settings.curClass = {
  color: -1,
  font: 'Vector',
  size: 24,
  middle: 24 + settings.day.size + 2 * settings.day.margin + settings.time.size * 11 + 2 * settings.time.margin + settings.gap + settings.weekday.size + 2 * settings.weekday.margin + 24 / 2 + 2, //screen.height - 50,
  center: screen.center,
  margin: 2
};
settings.nextClass = {
  color: -1,
  font: 'Vector',
  size: 20,
  middle: 24 + settings.day.size + 2 * settings.day.margin + settings.time.size * 11 + 2 * settings.time.margin + settings.gap + settings.weekday.size + 2 * settings.weekday.margin + settings.curClass.size + 2 * settings.curClass.margin + 20 / 2 + 2, //screen.height - 20,
  center: screen.center,
  margin: 2
};
settings.dayPlan = {
  color: -1,
  font: 'Vector',
  size: 14,
  middle: 24 + settings.day.size + 2 * settings.day.margin + settings.time.size * 11 + 2 * settings.time.margin + settings.gap + settings.weekday.size + 2 * settings.weekday.margin + settings.curClass.size + 2 * settings.curClass.margin + 14 / 2 + 2, //screen.height - 20,
  center: screen.center,
  margin: 2
};

const drawTime = function(date) {
  const t = settings.time;

  const hours = (" " + date.getHours()).substr(-2);
  const minutes = ("0" + date.getMinutes()).substr(-2);

  draw(t, hours + ":" + minutes);
};

const drawDay = function(date) {
  const dayName = locale.dow(date);
  const month = locale.month(date);
  const day = date.getDate();
  const dayMonth = locale.dayFirst ? `${day}. ${month}` : `${month} ${day}`;

  const d = settings.day;
  draw(d, dayMonth);

  const wd = settings.weekday;
  draw(wd, dayName);
};

const drawCurClass = function(curClass) {
  const cc = settings.curClass;
  draw(cc, curClass.gone + " " + curClass.name.substr(0,10) + " " + curClass.last);
};

const drawNextClass = function(nextClass) {
  const nc = settings.nextClass;
  draw(nc, nextClass.name.substr(0,10) + " in " + nextClass.until + "min");
};

const drawDayPlan = function(dayPlan) {
  const dp = settings.dayPlan;

  var classes = "";
  dayPlan.events.forEach(function(e) {
    classes += " " + e.name;
  });
  const ds = dayPlan.title + ":" + classes;

  draw(dp, ds.substr(0, 30));
  if(ds.length > 30
    const tmp = dp.middle;
    dp.middle = dp.middle + dp.size + dp.margin;
    draw(dp, ds.substr(30));
    dp.middle = tmp;
  }
};

const draw = function(config, string) {
  //g.setColor('#666666');
  g.clearRect(0, config.middle - (config.size / 2 + config.margin), 240, config.middle + (config.size / 2 + config.margin));
  g.setColor(config.color);
  g.setFont(config.font, config.size);
  g.setFontAlign(0, 0); // centered
  g.drawString(string, config.center, config.middle, true);
};


var currentWeekDay;
var dayPlan;
var currentMinute;
const tick = function(drawAll) {
  var now = new Date();
  //now.setHours(12);
  //now.setMinutes(27);
  //now.setSeconds(59);
  var dayChanged = false;

  var goneClass;
  var curClass;
  var nextClass;

  if (!dayPlan || currentWeekDay !== now.getDay()) {
    // load day plan when day has changed
    currentWeekDay = now.getDay();
    dayChanged = true;
    dayPlan = getDayPlan(now);
    dayPlan.events.sort(function(a, b) {
      var aDate = makeDate(now, a.start);
      var bDate = makeDate(now, b.start);
      if (aDate < bDate) {
        return -1;
      } else if (aDate > bDate) {
        return 1;
      }
      return 0;
    });
  }

  if (dayPlan) {

    for (var i = 0; i < dayPlan.events.length; i++) {
      const e = dayPlan.events[i];
      const eStartDate = makeDate(now, e.start);
      const eEndDate = makeDate(now, e.end);
      if (eEndDate < now) {
        // gone, keep latest
        goneClass = e;
      }
      if (eStartDate < now && eEndDate > now) {
        curClass = e;
      }
      if (eStartDate > now) {
        // upcoming, keep first
        nextClass = e;
        break;
      }
    }

    if (goneClass) {
      goneClass.gone = Math.floor((makeDate(now, goneClass.end) - makeDate(now, goneClass.start)) / 1000 / 60);
      goneClass.last = 0;
    }
    if (curClass) {
      curClass.gone = Math.floor((now - makeDate(now, curClass.start)) / 1000 / 60);
      curClass.last = Math.ceil((makeDate(now, curClass.end) - now) / 1000 / 60);
    }
    if (nextClass) {
      nextClass.gone = Math.floor((now - makeDate(now, nextClass.start)) / 1000 / 60);
      nextClass.until = -1 * nextClass.gone;
      nextClass.last = "";
    }
  } // END if(dayPlan)

  //console.log(goneClass);
  //console.log(curClass);
  //console.log(nextClass);

  const drawFace = function() {
    if (drawAll || !currentMinute || currentMinute !== now.getMinutes()) {
      currentMinute = now.getMinutes();
      drawTime(now);
    }

    if (drawAll || dayChanged) {
      // only called when day has changed
      drawDay(now);
    }

    if (!nextClass) {
      // in last class or after school
      var nextDay = new Date(now.getTime() + (24 * 60 * 60 * 1000));
      var tomorrowsPlan = getDayPlan(nextDay);
      while (!tomorrowsPlan) {
        nextDay = new Date(nextDay.getTime() + (24 * 60 * 60 * 1000));
        tomorrowsPlan = getDayPlan(nextDay);
      }
      drawDayPlan(tomorrowsPlan);
      if (!curClass) {
        // after school
        var tomorrowsFirstClass = tomorrowsPlan.events[0];
        if (tomorrowsFirstClass) {
          tomorrowsFirstClass.until = Math.ceil((now - makeDate(nextDay, tomorrowsFirstClass.start)) / 1000 / 60);
          tomorrowsFirstClass.gone = Math.ceil((now - makeDate(nextDay, tomorrowsFirstClass.start)) / 1000 / 60);
          tomorrowsFirstClass.last = "";
          drawCurClass(tomorrowsFirstClass);
        }
      } else {
        drawCurClass(curClass);
      }
    } else if (!curClass) {
      if (!goneClass) {
        // before school
        drawCurClass(nextClass);
        drawDayPlan(dayPlan);
      } else {
        drawCurClass(goneClass);
        drawNextClass(nextClass);
      }
    } else if (curClass) {
      // in class
      drawCurClass(curClass);
      drawNextClass(nextClass);
    }
  };

  drawFace();
};

const setButtons = function() {
  // Show launcher when middle button pressed
  setWatch(Bangle.showLauncher, BTN2, {
    repeat: false,
    edge: 'falling'
  });
};

var clock;
const start = function(forceDrawAll) {
  g.reset();
  Bangle.drawWidgets();
  tick(forceDrawAll);
  clock = setInterval(tick, 1000 * 10);
};

const stop = function() {
  // clear interval
  if (clock) {
    clearInterval(clock);
    clock = undefined;
  }
};

var SCREENACCESS = {
  withApp: true,
  request: function() {
    this.withApp = false;
    stop(); //clears redraw timers etc
    clearWatch(); //clears button handlers
  },
  release: function() {
    this.withApp = true;
    start(true); //redraw app screen, restart timers etc
    setButtons(); //install button event handlers
  }
};

Bangle.on('lcdPower', function(on) {
  if (!SCREENACCESS.withApp) return;
  if (on) {
    start();
  } else {
    stop();
  }
});

// do it
g.clear();
Bangle.loadWidgets();
start();
setButtons();
