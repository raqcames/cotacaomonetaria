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
    let BRL = request.body.queryResult.parameters['Real']
    let USD = request.body.queryResult.parameters['Dolar']
    let EUR = request.body.queryResult.parameters['Euro']
    let JPY = request.body.queryResult.parameters['Iene']
    let BTC = request.body.queryResult.parameters['Bitcoin']
    
    let frase = request.body.queryResult.queryText
    
    let array = []
    
    let originalEUR = request.body.queryResult.parameters.original['Euro']
    let originalBRL = request.body.queryResult.parameters.original['Real']
     
    https.get('https://economia.awesomeapi.com.br/json/all', (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        data = JSON.parse(data)
        
        // ESPAÇO PARA TESTE
        
        // Quebrando frase
        let retorno = frase.split(",")
        
        for (let i=0; i<retorno.lenght; i++){
          if(retorno[i] === (originalEUR || originalBRL)){
            array[i] = retorno[i]
          }
        }
        
        // Mudando palavras
        for (let i=0; i<array.lenght; i++){
          if(array[i] === originalEUR){
            array[i].replace(originalEUR, "EUR");
          }
          if(array[i] === originalBRL){
            array[i].replace(originalBRL, "BRL");
          }
          
        }
        
        let conversao
        switch (array[0] === "EUR"){
          case array[1] === "BRL":
            conversao = number / data.BRL.high
          response.json({"fulfillmentText": "A conversão do valor € " + number + " para o Real ficou de R$ " + conversao})
          break;
        }

        
        
        // FIM TESTE
        
        
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
