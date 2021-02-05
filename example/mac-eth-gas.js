// A bunch of quick code in progress.

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

var notifier = require('../');
var nc = new notifier.NotificationCenter();
var crontasks = notifier.crontasks;
var getEthData = notifier.getEthData;

var trueAnswer = 'Most def.';
var getInGwei = x => x/10;

// The amount to check if we're at or below this.
const threshold = 60;

crontasks.cronPingMinute({
  checkStatus,
  onTrigger: () => {
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
  },
});

const notifyLowGas = function(safeLow) {
  const title = `Wow, Eth Gas price is not horrible`;

  nc.notify(
    {
      title: `Eth Gas Price Is Sane`,
      message: `Wow, the eth safe low price is only ${safeLow}!`,
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
