'use strict';

const url = require('url');
const httpsRequest = require('./app/httpsRequest');
const httpRequest = require('./app/httpRequest');
const cheerio = require('cheerio');


const href = 'https://luxoptica.ua/';
const cssHref = 'http://sqdev.cc/node_modules/bulma/css/bulma.css';
const selector = 'img';
const requestPromise = require('request-promise');


function request() {
  var options = {
    uri: 'https://luxoptica.ua/',
    transform: function (body) {
        return cheerio.load(body);
    }
  };
 
  requestPromise(options)
    .then(($) => findHrefs($))
    .catch((reason) => console.log('Reason:', reason));
}

request();



function findHrefs($) {
  let cssLinks = $('link').toArray()
    .filter(link => link.attribs.type === 'text/css')
    .map(link => link.attribs.href);
  console.log( cssLinks );
  //console.log( $('head').html() );
}

function getCssByHref (href, selector) {

  let urlObj = url.parse(href);
  let options = {
    hostname: urlObj.hostname,
    port: 80,
    path: urlObj.path,
    method: 'GET'
  };
  let bodyRequest;
  
  if (urlObj.protocol === 'https:') {  
    bodyRequest = httpsRequest;
  } else if (urlObj.protocol === 'http:') {
    bodyRequest = httpRequest;
  }
  
  bodyRequest(options)
  .then((body) => ('}' + body))
  .then((body) => parseCss(body, selector))
  .catch((reason) => console.log('Reason:', reason));
}

//getCssByHref(cssHref, selector);


function parseCss(body, basicSelector) {
  
  let regexp = new RegExp(`[,s]*${basicSelector} [wsd.#,-]*{`, 'gi');
  let result;

  while (result = regexp.exec(body)) {

    let indexOfBracket = body.lastIndexOf('}', result.index) + 1;
    let indexOfСomma = body.lastIndexOf(',', result.index) + 1; 
    let startIndexOfSelector = indexOfBracket > indexOfСomma ? indexOfBracket : indexOfСomma;
    let lastIndexOfSelector = regexp.lastIndex;

    let selector = body.slice(startIndexOfSelector, lastIndexOfSelector).trim();

    let startIndexOfStyles = body.indexOf('{', regexp.lastIndex);
    let lastIndexOfStyles = body.indexOf('}', regexp.lastIndex) + 1;

    let styles = body.slice(startIndexOfStyles, lastIndexOfStyles);
   
    console.log(selector, styles);
  }
}