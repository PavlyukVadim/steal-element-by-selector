'use strict';

const url = require('url');
const http = require('http');
const https = require('https');

let href = 'https://www.google.com.ua';

function getCodeByHref (href) {

  let urlObj = url.parse(href);
  let options = {
    hostname: urlObj.hostname,
    port: 443,
    path: urlObj.path,
    method: 'GET'
  };

  if (urlObj.protocol === 'https:') {
    httpsRequest(options);
  } else if (urlObj.protocol === 'http:') {
    httpRequest(options);
  } 
  
}

getCodeByHref("https://www.google.com.ua");

function httpRequest(options) {
  var req = http.request(options, (res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  });

  req.end();
}

function httpsRequest(options) {
  var req = https.request(options, (res) => {
    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  req.on('error', (e) => {
    console.error(e);
  });
  req.end();
}