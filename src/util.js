const https = require("https");

export const get = url => {
    return new Promise((resolve, reject) => {
      
        https.get(url, resp => {
          let data
            resp.on("data", chunk => {
                data += chunk;
            });

            resp.on("end", () => {
                try {
                    data = JSON.parse(data);
                    resolve(data)
                } catch (error) {
                    reject(error)
                }
            })
        })
    })
}