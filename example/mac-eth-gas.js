// A bunch of quick code in progress.

const path = require('path');
const notifier = require('../');
const config = require(path.resolve('config.json'));

// initialize to active - force to true for now.
let isAppActivated = true;

// for later
const startApp = () => {
  isAppActivated = true;
}

const stopApp = () => {
  isAppActivated = false;
}

const checkStatus = () => {
  return {
    isActive: isAppActivated,
  };
}

const nc = new notifier.NotificationCenter();
const crontasks = notifier.crontasks;
const getEthData = notifier.getEthData;

const trueAnswer = 'Most def.';
const getInGwei = x => x/10;

// The amount to check if we're at or below this.
const threshold = config.threshold;

const startMsg = `The watcher has started.
This will ping an Eth GAS API once a minute
and it will send you a mac browser alert if the eth gas price falls below ${threshold} gwei.
You can quit with:  ⌘ + .
`

const onTrigger = () => {
  getEthData.getData().then(data => {
    const parsedData = {
      fast: getInGwei(data.fast),
      fastest: getInGwei(data.fastest),
      safeLow: getInGwei(data.safeLow),
      average: getInGwei(data.average),
    };

    console.log(parsedData);

    if (parsedData.safeLow <= threshold) {
      notifyLowGas(parsedData.safeLow);
    }
  });
}

const notifyLowGas = function(safeLow) {
  const title = `Wow, Eth Gas price is not horrible`;

  nc.notify(
    {
      title: `Eth Gas Price Is Sane`,
      message: `Wow, the eth safe low price is only ${safeLow} gwei!`,
      sound: 'Funk',
      // case sensitive
      // closeLabel: 'Absolutely not',
      // actions: trueAnswer
    },
    function(err, response, metadata) {
      if (err) throw err;
      console.log(metadata);

      if (metadata.activationValue !== trueAnswer) {
        return; // No need to continue
      }

      nc.notify(
        {
          title: 'Notifications',
          message: 'Do you want to reply to them?',
          sound: 'Funk',
          // case sensitive
          reply: true
        },
        function(err, response, metadata) {
          if (err) throw err;
          console.log(metadata);
        }
      );
    }
  );
}

nc.on('replied', function(obj, options, metadata) {
  console.log('User replied', metadata);
});


/////// Kick it off.

// Send the start message.
console.log(startMsg);

// trigger once to start.
onTrigger();

// Then start a minutly watch.
crontasks.cronPingMinute({
  checkStatus,
  onTrigger: onTrigger,
});
