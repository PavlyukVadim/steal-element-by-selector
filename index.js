'use strict';

const url = require('url');
const cheerio = require('cheerio');
const requestPromise = require('request-promise');

const href = 'https://luxoptica.ua/';
const cssHref = 'http://sqdev.cc/node_modules/bulma/css/bulma.css';
const selector = 'img';



function getCssLinks(siteLink) {
  const options = {
    uri: siteLink,
    transform: function (body) {
      return cheerio.load(body);
    }
  };
  
  requestPromise(options)
    .then(($) => {
        let cssLinks = $('link').toArray()
          .filter(link => link.attribs.type === 'text/css')
          .map(link => link.attribs.href);
          console.log( cssLinks );
        return cssLinks;  
    })
    .catch((reason) => console.log('Reason:', reason));  
}
getCssLinks(href);

function getCssByHref (cssLink, selector) {
  const options = {
    uri: cssLink
  }

  requestPromise(options)
    .then((body) => ('}' + body))
    .then((body) => parseCss(body, selector))
    .catch((reason) => console.log('Reason:', reason));
}

getCssByHref(cssHref, selector);


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