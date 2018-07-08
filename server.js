const express = require('express');
const app = express();
const { getComputer, getQueue } = require('./jenkins');

const path = require('path');
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/computer', function(req, res) {
  getComputer((obj) => {
    res.json(obj);
  });
});

app.get('/queue', function(req, res) {
  getQueue((obj) => {
    res.json(obj);
  });
});

app.listen(process.env.PORT || 3000 , function() {
  console.log('Listening...');
});
