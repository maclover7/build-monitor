const request = require('request');
const { getComputer, getQueue } = require('./jenkins');

const irc = require('irc');
const ircClient = new irc.Client('irc.freenode.net', process.env.IRC_NICKNAME, {
  userName: process.env.IRC_NICKNAME,
  password: process.env.IRC_PASSWORD
});

ircClient.addListener('error', (err) => {
  console.log(`err: ${JSON.stringify(err)}`);
});

const sendAlert = (body) => {
  var body = `${body} (via <https://node-build-monitor.herokuapp.com|node-build-monitor>)`;

  request({
    method: 'POST',
    uri: process.env.SLACK_URL,
    json: {
      channel: "#buildalerts",
      username: "node-build-monitor",
      text: body,
      icon_emoji: ":ghost:"
    }
  }, (err, res, req) => {
    if (err || (res.statusCode !== 200)) {
      console.log([err, res]);
    }

    ircClient.connect(() => {
      ircClient.say('#maclover7', body);
      ircClient.disconnect(() => { process.exit(0); });
    });
  })
};

getComputer(({ computerOfflineHeadline, computerOfflinePercentage }) => {
  if (computerOfflinePercentage > 10) {
    sendAlert(`Many machines offline: ${computerOfflineHeadline}`);
  }
});

getQueue(({ queue, queueLength }) => {
  if (queueLength > 10) {
    const { reason, count } = queue[0];
    sendAlert(`Large build queue: ${queueLength} jobs (${reason}, ${count})`);
  }
});
