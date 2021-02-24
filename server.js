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

        response.json({"fulfillmentText": "Aqui vão as cotações do dia 😉 \n \n" 
                       + "✔️ Dólar Comercial: $ " + USD
                       + "\n✔️ Euro: € " + EUR
                       + "\n✔️ Iene Japonês: ¥ " + JPY
                       + "\n✔️ Bitcoin: ฿ " + BTC})
      })
    })
  }
  
   if (intentName == "Conversao") {
    let number = request.body.queryResult.parameters['number']
    let USD = request.body.queryResult.parameters['Dolar']
    let EUR = request.body.queryResult.parameters['Euro']
    let JPY = request.body.queryResult.parameters['Iene']
    let BTC = request.body.queryResult.parameters['Bitcoin']
     
    https.get('https://economia.awesomeapi.com.br/json/all', (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        data = JSON.parse(data)
        
        if(USD === "USD"){
          let conversao = number / data.USD.high
          response.json({"fulfillmentText": "A conversão do valor R$ " + number + " para o Dólar Americano ficou de $ " + conversao})
        }
        
        if(EUR === "EUR"){
          let conversao = number / data.EUR.high
          response.json({"fulfillmentText": "A conversão do valor R$ " + number + " para o Euro ficou de € " + conversao})
        }
        
        if(JPY === "JPY"){
          let conversao = number / data.JPY.high
          response.json({"fulfillmentText": "A conversão do valor R$ " + number + " para o Iene Japonês ficou de ¥ " + conversao})
        }
        
        if(BTC === "BTC"){
          let conversao = number / data.BTC.high
          response.json({"fulfillmentText": "A conversão do valor R$ " + number + " para o Bitcoin ficou de ฿ " + conversao})
        }
      })

    })

  }
  
});


const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
