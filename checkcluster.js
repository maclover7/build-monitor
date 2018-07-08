const request = require('request');
const { getComputer, getQueue } = require('./jenkins');

const sendAlert = (body) => {
  request({
    method: 'POST',
    uri: process.env.SLACK_URL,
    json: {
      channel: "#buildalerts",
      username: "node-build-monitor",
      text: `${body} (via <https://node-build-monitor.herokuapp.com|node-build-monitor>)`,
      icon_emoji: ":ghost:"
    }
  }, (err, res, req) => {
    if (err || (res.statusCode !== 200)) {
      console.log([err, res]);
    }
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
