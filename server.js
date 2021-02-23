const express = require("express");
const app = express();
const bodyParser = require("body-parser")

const moeda = require("https://economia.awesomeapi.com.br/json/all")

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
  
  if(intentName == "Conversao"){
    var resp = request.body.queryResult.parameters['moeda']
    
    moeda(resp, {sync: false, timeout:1000}).then(conversao => {
      response.json({"fulfillmentText": conversao.high})
    })
  }
  
});

app.get("https://economia.awesomeapi.com.br/json/all", (request, response) => {
  
});


const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
