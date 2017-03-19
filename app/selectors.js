'use strict';

const requestPromise = require('request-promise');
const cheerio = require('cheerio');


function getArrayOfSelectors(siteLink, basicSelector) {
  const options = {
    uri: siteLink,
    transform: function (body) {
      return cheerio.load(body);
    }
  };
  const arrayOfSelectors = [];
  let uniqueArrayOfSelectors = [];

  return new Promise( function(resolve, reject) {
    requestPromise(options)
      .then(($) => {
        let element = $(basicSelector)
        getChildElements(element[0], arrayOfSelectors);
        uniqueArrayOfSelectors = arrayOfSelectors.filter((item, i, arr) => arr.indexOf(item) === i);
        resolve(uniqueArrayOfSelectors);
      })
      .catch((reason) => console.log('Reason:', reason));
  })
}

//getArrayOfSelectors(siteLink, '#slider-2 .container .row div h2');
//#slider-2 .container .row div h2


function getChildElements(element, selectors) {
  if (!element) return;
  getSelectorsByElement(element, selectors)
  let children = element.children.filter((element) => element.type === 'tag');
  children.forEach((child) => getChildElements(child, selectors));
}


function getSelectorsByElement(element, selectors) {
  selectors.push(element.name)
  if (element.attribs.id) {
    selectors.push(`#${element.attribs.id}`)
  }
  if (element.attribs.class) {
    selectors.push(...element.attribs.class.split(' ').map((className) => `.${className}`));
  }
}


module.exports = { getArrayOfSelectors };
