'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const app = express();

app.set('views', path.join(__dirname, 'views'));

function getHash(filename) {
  return crypto.createHash('md5').update(fs.readFileSync(__dirname + '/static/' + filename)).digest('hex').substr(0, 5);
}
function getStatic(filename) {
  return '/static/' + getHash(filename) + '/' + filename;
}

app.get('/static/:hash/:filename', (req, res, next) => {
  const hash = getHash(req.params.filename);
  if (hash !== req.params.hash) return next();
  res.sendFile(__dirname + '/static/' + req.params.filename);
});

app.use(function (req, res, next) {
  var file = path.join(__dirname, 'views', req.path, 'index.pug');
  fs.exists(file, function (exists) {
    if (exists) return res.render(file, {getStatic});
    else return next();
  });
});
app.use(express.static(__dirname));

module.exports = app.listen(3000);
console.log('server listening on http://localhost:3000');
