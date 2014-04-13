'use strict';

var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();

app.set('views', path.join(__dirname, 'views'));

function mangle(text) {
  var out = '';

  for (var i = 0; i < text.length; i++) {
    var ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

app.use(function (req, res, next) {
  var file = path.join(__dirname, 'views', req.path, 'index.jade');
  fs.exists(file, function (exists) {
    if (exists) return res.render(file, {mangle: mangle});
    else return next();
  });
});
app.use(express.static(__dirname));

module.exports = app.listen(3000);
console.log('server listening on http://localhost:3000');