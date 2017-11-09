const express = require('express');
const app = express();
const request = require('request');

const path = require('path');
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/computer', function(req, res) {
  request({ url: 'https://ci.nodejs.org/computer/api/json?pretty=true', json: true }, (err, _, apiResponse) => {
    var offlineComputers = [];

    for(var computer of apiResponse.computer) {
      if (computer.offline) {
        offlineComputers.push({
          name: computer.displayName,
          reason: computer.offlineCauseReason || 'manually removed'
        });
      }
    }

    res.json({
      computers: offlineComputers,
      offlineCount: offlineComputers.length,
      totalCount: apiResponse.computer.filter((c) => { return c._class === 'hudson.slaves.SlaveComputer' }).length
    });
  });
});

app.get('/queue', function(req, res) {
  request({ url: 'https://ci.nodejs.org/queue/api/json', json: true }, (err, _, apiResponse) => {
    // Create an array with list of "reasons why" jobs are in queue.
    // Then create a map which counts the number of time each reason appears.
    // Sorted with highest number of common reason at the top, and decreases after.
    var queue = [];

    for(var item of apiResponse.items) {
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

    res.json({
      queue: queue
    });
  });
});

app.listen(process.env.PORT || 3000 , function() {
  console.log('Listening...');
});
