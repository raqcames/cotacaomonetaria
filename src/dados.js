const https = require("https");

module.exports.get = url => {
    return new Promise((resolve, reject) => {
      
        https.get(url, resp => {
          let data = ''
            resp.on("data", chunk => {
                data += chunk;
            });

            resp.on("end", () => {
                data = JSON.parse(data);
                resolve(data);
            })
        })
    })
}