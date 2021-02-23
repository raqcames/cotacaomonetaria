const express = require("express");
const app = express();
const bodyParser = require("body-parser")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});


app.post('/Dialogflow', function(request, response){
  var intentName = request.body.queryResult.intent.displayName;
  
  if(intentName == "Cotacao"){
    response.json({"fulfillmentText": "Teste"})
  }
});

app.get("https://economia.awesomeapi.com.br/json/all", (request, response) => {
  
});




// listen for requests :)
//const listener = app.listen(process.env.PORT, () => {
//  console.log("Your app is listening on port " + listener.address().port);
//});
