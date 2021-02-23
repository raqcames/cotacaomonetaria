// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of dreams to the webpage
app.get("https://economia.awesomeapi.com.br/json/all", (request, response) => {
  // express helps us take JS objects and send them as JSON
  var teste = JSON.parse(body);
  console.log("" + teste[''])
  response.json(dreams);
});

var request = require('request');
request('http://api.openweathermap.org/data/2.5/weather?q=SaoPaulo&APPID=604b9d1c6b9e0b3e94b0b3ffd01fe6ba', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  var parsedWeather = JSON.parse(body);
  console.log('A temperatura atual em São Paulo é ' + parsedWeather['main']['temp']); // Print the Temperature in the city of São Paulo
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
