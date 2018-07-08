const request = require('request');

const authCreds = `${process.env.JENKINS_USERNAME}:${process.env.JENKINS_PASSWORD}`;
const getJSON = (path, cb) => {
  request(
    { url: `https://${authCreds}@ci.nodejs.org/${path}/api/json`, json: true },
    cb);
};

const getComputer = (cb) => {
  getJSON('computer', (err, response, body) => {
    var offlineComputers = [];

    for(var computer of body.computer) {
      if (computer.offline) {
        offlineComputers.push({
          name: computer.displayName,
          reason: computer.offlineCauseReason || 'manually removed'
        });
      }
    }

    const totalCount = body.computer.filter((c) => { return c._class === 'hudson.slaves.SlaveComputer' }).length;
    const computerOfflinePercentage = Math.round((offlineComputers.length / totalCount) * 100);

    cb({
      computers: offlineComputers,
      offlineCount: offlineComputers.length,
      totalCount,
      computerOfflinePercentage,
      computerOfflineHeadline: `${offlineComputers.length}/${totalCount}, ${computerOfflinePercentage}%`
    });
  });
};

const getQueue = (cb) => {
  getJSON('queue', (err, response, body) => {
    // Create an array with list of "reasons why" jobs are in queue.
    // Then create a map which counts the number of time each reason appears.
    // Sorted with highest number of common reason at the top, and decreases after.
    var queue = [];

    for(var item of body.items) {
      var existingItem = queue.filter(function(i) {
        return i.reason === item.why;
      })[0];

      if (existingItem) {
        existingItem.count++;
      } else {
        queue.push({ reason: item.why, count: 1 });
      }
    }

    queue.sort(function(a, b) { return b.count - a.count; });

    cb({
      queue,
      queueLength: queue.reduce((a, b) => { return a + b.count; }, 0)
    });
  });
};

module.exports = { getComputer, getQueue };
