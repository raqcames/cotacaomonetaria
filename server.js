const express = require("express");
const app = express();

app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});


app.get("https://economia.awesomeapi.com.br/json/all", (request, response) => {
  
});




// listen for requests :)
//const listener = app.listen(process.env.PORT, () => {
//  console.log("Your app is listening on port " + listener.address().port);
//});
