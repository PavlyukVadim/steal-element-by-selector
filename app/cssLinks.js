'use strict';

const requestPromise = require('request-promise');
const cheerio = require('cheerio');


function getArrayOfCssLinks(siteLink) {
  const options = {
    uri: siteLink,
    transform: function (body) {
      return cheerio.load(body);
    }
  };
  return new Promise( function( resolve, reject ) {
    requestPromise(options)
      .then(($) => {
          let cssLinks = $('link').toArray()
            .map(link => link.attribs.href)
          resolve(linksValidation(siteLink, cssLinks)); 
      })
      .catch((reason) => console.log('Reason:', reason));
  }) 
}


function linksValidation(siteLink, links) {
  return links.map((link) => {
    if (!link.includes('http')) return siteLink + link;
    return link; 
  });
}


module.exports = { getArrayOfCssLinks };