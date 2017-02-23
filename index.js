'reuse strict';

const url = require('url');
const httpsRequest = require('./app/httpsRequest');
const httpRequest = require('./app/httpRequest');


let href = 'https://www.google.com.ua';

function getCodeByHref (href) {

  let urlObj = url.parse(href);
  let options = {
    hostname: urlObj.hostname,
    port: 443,
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
  .then((body) => console.log(body) )
  .catch((reason) => console.log('Reason:', reason));
   
}

getCodeByHref(href);