'use strict';

var url = require('url');
var fs = require('fs');
var stop = require('stop');
var s3 = require('s3');

var server = require('./server.js');

stop.getWebsiteStream('http://localhost:3000', {
  filter: function (currentURL) {
    return url.parse(currentURL).hostname === 'localhost';
  },
  parallel: 1
})
//.syphon(stop.addFavicon())
.syphon(stop.minifyJS())
.syphon(stop.minifyCSS({deadCode: true, silent: true}))
.syphon(stop.log())
.syphon(stop.checkStatusCodes([200]))
.syphon(stop.writeFileSystem(__dirname + '/out'))
.wait().done(function () {
  server.close();
  console.log('done building website');
  if (
    process.env.TRAVIS_BRANCH !== 'master' ||
    process.env.TRAVIS_PULL_REQUEST !== 'false'
  ) {
    return;
  }
  var client = s3.createClient({
    s3Options: {
      accessKeyId: process.env.S3_KEY,
      secretAccessKey: process.env.S3_SECRET,
      region: process.env.S3_REGION
    },
  });
  var uploader = client.uploadDir({
    localDir: __dirname + '/out',
    deleteRemoved: true,
    s3Params: {
      Bucket: process.env.S3_BUCKET,
      Prefix: ''
    }
  });
  uploader.on('error', function(err) {
    console.error('unable to sync:', err.stack);
  });
  uploader.on('end', function() {
    console.log("done uploading website");
  });
});
