'use strict';

const requestPromise = require('request-promise');


function getCssByLink(cssLink, selector) {
  const options = {
    uri: cssLink
  }
  return new Promise(function(resolve, reject) {
    requestPromise(options)
      .then((body) => ('}' + body))
      .then((body) => {
      	resolve(parseCss(body, selector));
      })
      .catch((reason) => console.log('Reason:', reason));
  });  
}


function parseCss(body, basicSelector) {
  let regexp = new RegExp(`([\n ,s])+${basicSelector}[ wsd.#,-]*[{,]{1}`, 'gi');
  let result;
  let arrayOfStyles = [];

  while (result = regexp.exec(body)) {
    let indexOfBracket = body.lastIndexOf('}', result.index) + 1;
    let indexOfСomma = body.lastIndexOf(',', result.index) + 1; 
    let startIndexOfSelector = indexOfBracket > indexOfСomma ? indexOfBracket : indexOfСomma;
    let lastIndexOfSelector = regexp.lastIndex;
    let selector = body.slice(startIndexOfSelector, lastIndexOfSelector - 1).trim();
    let startIndexOfStyles = body.indexOf('{', regexp.lastIndex - 1);
    let lastIndexOfStyles = body.indexOf('}', regexp.lastIndex) + 1;
    let styles = body.slice(startIndexOfStyles, lastIndexOfStyles);
    arrayOfStyles.push(selector + ' ' + styles);
  }
  return arrayOfStyles;
}


module.exports = { getCssByLink };
