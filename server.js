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
  request('https://ci.nodejs.org/queue/api/json').pipe(res);
});

app.listen(process.env.PORT || 3000 , function() {
  console.log('Listening...');
});
