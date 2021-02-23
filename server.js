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
  
   if (intentName == "Conversao") {
    var moeda = request.body.queryResult.parameters['moeda']
    app.get('https://economia.awesomeapi.com.br/json/all', function (request2, response2) {
      //response.json({"fulfillmentText": response2})
      console.log(response2) 
    })

  }
  
});


const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
