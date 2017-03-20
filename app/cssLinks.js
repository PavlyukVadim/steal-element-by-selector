'use strict';

const requestPromise = require('request-promise');
const cheerio = require('cheerio');


function getArrayOfCssLinks(siteLink) {
  const options = {
    uri: siteLink,
    transform: (body) => cheerio.load(body)
  };
  return new Promise((resolve, reject) => {
    requestPromise(options)
      .then(($) => {
        const cssLinks = $('link').toArray()
          .map(link => link.attribs.href);
        resolve(linksValidation(siteLink, cssLinks));
      })
      .catch((reason) => console.log('Reason:', reason));
  });
}


function linksValidation(siteLink, links) {
  return links.map((link) => {
    link = link.replace(/\.\.\//g, '');
    if (!link.includes('http')) return siteLink + link;
    return link;
  });
}


module.exports = { getArrayOfCssLinks };
