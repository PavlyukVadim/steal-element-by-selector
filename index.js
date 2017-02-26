'use strict';

const url = require('url');
const httpsRequest = require('./app/httpsRequest');
const httpRequest = require('./app/httpRequest');
const cheerio = require('cheerio');


let href = 'https://luxoptica.ua/';
let cssHref = 'http://sqdev.cc/node_modules/bulma/css/bulma.css';
let selector = 'img';

function getCodeByHref (href) {

  let urlObj = url.parse(href);
  let options = {
    hostname: urlObj.hostname,
    port: 443,
    path: urlObj.path,
    method: 'GET'
  };
  let bodyRequest;
  let $;
  if (urlObj.protocol === 'https:') {  
    bodyRequest = httpsRequest;
  } else if (urlObj.protocol === 'http:') {
    bodyRequest = httpRequest;
  }
  
  bodyRequest(options)
  .then((body) => $ = cheerio.load(body))
  .then(($) => findHrefs($))
  .catch((reason) => console.log('Reason:', reason));
   
}

//getCodeByHref(href);

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

getCssByHref(cssHref, selector);


function parseCss(body, selector) {
  
  let regexp = new RegExp(selector, 'gi');
  let result;

  while (result = regexp.exec(body)) {
    console.log( 'Найдено: ' + result[0] + ' на позиции:' + result.index );
    console.log(body.slice(result.index, regexp.lastIndex))
  }
}