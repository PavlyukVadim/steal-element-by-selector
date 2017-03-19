'use strict';

const requestPromise = require('request-promise');


function getCssByLink(cssLink, selector) {
  const options = {
    uri: cssLink
  };
  return new Promise((resolve, reject) => {
    requestPromise(options)
      .then((body) => ('}' + body))
      .then((body) => {
        resolve(parseCss(body, selector));
      })
      .catch((reason) => console.log('Reason:', reason));
  });
}


function parseCss(body, basicSelector) {
  const regexp = new RegExp(`([\n ,s])+${basicSelector}[ wsd.#,-]*[{,]{1}`, 'gi');
  let result;
  const arrayOfStyles = [];

  while (result = regexp.exec(body)) {
    const indexOfBracket = body.lastIndexOf('}', result.index) + 1;
    const indexOfСomma = body.lastIndexOf(',', result.index) + 1;
    const startIndexOfSelector = indexOfBracket > indexOfСomma ? indexOfBracket : indexOfСomma;
    const lastIndexOfSelector = regexp.lastIndex;
    const selector = body.slice(startIndexOfSelector, lastIndexOfSelector - 1).trim();
    const startIndexOfStyles = body.indexOf('{', regexp.lastIndex - 1);
    const lastIndexOfStyles = body.indexOf('}', regexp.lastIndex) + 1;
    const styles = body.slice(startIndexOfStyles, lastIndexOfStyles);
    arrayOfStyles.push(selector + ' ' + styles);
  }
  return arrayOfStyles;
}


module.exports = { getCssByLink };
