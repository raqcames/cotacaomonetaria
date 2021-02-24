const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const https = require("https")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});


app.post('/Dialogflow', function(request, response){
  var intentName = request.body.queryResult.intent.displayName;
  
  if(intentName == "Cotacao"){
    https.get('https://economia.awesomeapi.com.br/json/all', (resp) => {
      let data = '';

      // Isso aqui é para carregar todo o conteúdo pq ele não é recebido inteiro.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // Vai ser executado quando todo o conteúdo for carregado
      resp.on('end', () => {
        data = JSON.parse(data)
        
        let USD = data.USD.high
        let EUR = data.EUR.high
        let JPY = data.JPY.high
        let BTC = data.BTC.high

        response.json({"fulfillmentText": "A cotação do Real está: \n \n" 
                       + "Dólar Comercial: " + USD
                       + "\nEuro: " + EUR
                       + "\nIene Japonês: " + JPY
                       + "\nBitcoin: " + BTC})
      })
    })
  }
  
   if (intentName == "Conversao") {
    let number = request.body.queryResult.parameters['number']
    let euro = request.body.querResult.parameters['Euro']
    
    response.json({"fulfillmentText": "Ta captando o euro"+euro+number })
     
    /*https.get('https://economia.awesomeapi.com.br/json/all', (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        data = JSON.parse(data)

        response.json({"fulfillmentText": "Ta captando o euro"+euro })
        
        if(euro === data.EUR){
          response.json({"fulfillmentText": "Ta captando o euro" })
        } else {
          response.json({"fulfillmentText": "Não ta captando o euro" })
        }
      })

    })*/

  }
  
});


const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
