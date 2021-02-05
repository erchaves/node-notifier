var CronJob = require('cron').CronJob;

// note: these are the parameters for CronJob
// function CronJob(
//   cronTime,
//   onTick,
//   onComplete,
//   startNow,
//   timeZone,
//   context,
//   runOnInit,
//   utcOffset,
//   unrefTimeout
// ) {}

const onComplete = null;
const shouldStartImmediately = true;
const timeZone = 'America/Los_Angeles';

// 1 second interval
// to avoid firing multiple crons at the same time,
// Buffer the daily by timeoutInterval * 2 and
// Buffer the weekly by timeoutInterval * 1
// So each longer time-scope cron can clear the smaller ones.
const timeoutInterval = 1000;

let setIntervalDaily = null;
let setIntervalWeekly = null;
let setIntervalMonthly = null;

const oncePerSec = '* * * * * *'
const oncePerMin = '* * * * *'

const cronTest = settings => {
  const job = new CronJob(oncePerSec, () => {
    const status = settings.checkStatus();

    if (!status.isActive) {
      return;
    }

    const d = new Date();
    console.log('Test:', d);

    settings.onTrigger && settings.onTrigger();
  }, onComplete, shouldStartImmediately, timeZone);

  return job;
};

const cronPingMinute = settings => {
  const job = new CronJob(oncePerMin, () => {
    const status = settings.checkStatus();

    if (!status.isActive) {
      return;
    }

    const d = new Date();
    console.log('Minute Ping Test:', d);

    settings.onTrigger && settings.onTrigger();
  }, onComplete, shouldStartImmediately, timeZone);

  return job;
};

module.exports = {
  cronTest: cronTest,
  cronPingMinute: cronPingMinute,
};
