const express = require('express');
const app = express();
const request = require('request');

const path = require('path');
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/computer', function(req, res) {
  request('https://ci.nodejs.org/computer/api/json?pretty=true').pipe(res);
});

app.get('/queue', function(req, res) {
  request('https://ci.nodejs.org/queue/api/json').pipe(res);
});

app.listen(process.env.PORT || 3000 , function() {
  console.log('Listening...');
});
