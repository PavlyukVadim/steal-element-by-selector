'reuse strict';

const http = require('http');

module.exports = (options) => {
  return new Promise((resolve, reject) => {
    let req = http.request(options, (res) => {
      res.setEncoding('utf8');


      let code = res.statusCode;
      if (code !== 200) {
        return reject(new Error(`HTTP status code ${code}`));
      }

      res.on('error', reject);      

      let chunks = [];
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      res.on('end', () => {
        let body = chunks.join('');
        resolve(body);
      });


    });

    req.on('error', reject);

    req.end();  
  });
}
