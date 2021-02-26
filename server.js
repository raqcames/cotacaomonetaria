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
        
        let USD = data.USD.bid
        let EUR = data.EUR.bid
        let JPY = data.JPY.bid
        let BTC = data.BTC.bid

        response.json({"fulfillmentText": "Aqui vão as cotações do dia 😉 \n \n" 
                       + "✔️ Dólar Comercial: $ " + USD
                       + "\n✔️ Euro: € " + EUR
                       + "\n✔️ Yen: ¥ " + JPY
                       + "\n✔️ Bitcoin: ฿ " + BTC
                       + "\n \nPosso ajudar em mais alguma coisa? 🤔"})
      })
    })
  }
  
   if (intentName == "Conversao") {
     
    let number = request.body.queryResult.parameters['number']
    
    let BRL = request.body.queryResult.parameters['real']
    let USD = request.body.queryResult.parameters['dolar']
    let EUR = request.body.queryResult.parameters['euro']
    let JPY = request.body.queryResult.parameters['iene']
    let BTC = request.body.queryResult.parameters['bitcoin']
    
    let frase = request.body.queryResult.queryText
    let retorno = frase.split(' ')
    
    let array = []

    let originalEUR = request.body.queryResult.outputContexts[0].parameters['euro.original']
    let originalBRL = request.body.queryResult.outputContexts[0].parameters['real.original']
    let originalUSD = request.body.queryResult.outputContexts[0].parameters['dolar.original']
    let originalJPY = request.body.queryResult.outputContexts[0].parameters['iene.original']
    let originalBTC = request.body.queryResult.outputContexts[0].parameters['bitcoin.original']
     
    https.get('https://economia.awesomeapi.com.br/json/all', (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        data = JSON.parse(data)
        
        // Quebrando frase
        for (let i=0; i<retorno.length; i++){
          if((retorno[i] == originalEUR) || (retorno[i] == originalBRL) || (retorno[i] == originalUSD) || (retorno[i] == originalJPY) || (retorno[i] == originalBTC)){
            array.push(retorno[i])
          }
        }

        
        // Mudando palavras       
        for (let i=0; i<array.length; i++){
          if(array[i] == originalEUR){
            array[i] = "EUR";
          }
          if(array[i] == originalBRL){
            array[i] = "BRL";
          }
          if(array[i] == originalUSD){
            array[i] = "USD";
          }
          if(array[i] == originalJPY){
            array[i] = "JPY";
          }
          if(array[i] == originalBTC){
            array[i] = "BTC";
          }
        }
        
        // Conversão
        
        if(array.length == 1){
          if(array[0] === "USD"){
            let conversao = number / data.USD.bid
            response.json({"fulfillmentText": "A conversão do valor R$ " + number + " para o Dólar Americano ficou de $ " + conversao.toFixed(2)})
          }  
        
          if(EUR === "EUR"){
            let conversao = number / data.EUR.bid
            response.json({"fulfillmentText": "A conversão do valor R$ " + number + " para o Euro ficou de € " + conversao.toFixed(2)})
          }
        
          if(JPY === "JPY"){
            let conversao = number / data.JPY.bid
            response.json({"fulfillmentText": "A conversão do valor R$ " + number + " para o Iene Japonês ficou de ¥ " + conversao.toFixed(2)})
          }
        
          if(BTC === "BTC"){
            let conversao = number / data.BTC.bid
            response.json({"fulfillmentText": "A conversão do valor R$ " + number + " para o Bitcoin ficou de ฿ " + conversao})
          }
        } else {
        
        if(array[0] == "EUR"){
          switch (array[1]){
            case "BRL":
              response.json({"fulfillmentText": "A conversão do valor € " + number + " para o Real ficou de R$ " + (number * data.EUR.bid).toFixed(2)})
              break
            case "USD":
              response.json({"fulfillmentText": "A conversão do valor € " + number + " para o Dólar Americano ficou de $ " + ((number * data.EUR.bid)/ data.USD.bid).toFixed(2)})
              break
            case "JPY":
              response.json({"fulfillmentText": "A conversão do valor € " + number + " para o Iene Japonês ficou de ¥ " + ((number * data.EUR.bid)/ data.JPY.bid).toFixed(2)})
              break
            case "BTC":
              response.json({"fulfillmentText": "A conversão do valor € " + number + " para o Bitcoin ficou de ฿ " + ((number * data.EUR.bid)/ data.BTC.bid)})
              break
          }
        }
        
        if(array[0] == "BRL"){
          switch (array[1]){
            case "EUR":
              response.json({"fulfillmentText": "A conversão do valor R$ " + number + " para o Real ficou de € " + (number / data.EUR.bid).toFixed(2)})
              break
            case "USD":
              response.json({"fulfillmentText": "A conversão do valor R$ " + number + " para o Dólar Americano ficou de $ " + (number / data.USD.bid).toFixed(2)})
              break
            case "JPY":
              response.json({"fulfillmentText": "A conversão do valor R$ " + number + " para o Iene Japonês ficou de ¥ " + (number / data.JPY.bid).toFixed(2)})
              break
            case "BTC":
              response.json({"fulfillmentText": "A conversão do valor R$ " + number + " para o Bitcoin ficou de ฿ " + (number / data.BTC.bid)})
              break
          }
        }
        
        if(array[0] == "USD"){
          switch (array[1]){
            case "BRL":
              response.json({"fulfillmentText": "A conversão do valor $ " + number + " para o Real ficou de R$ " + (number * data.USD.bid).toFixed(2)})
              break
            case "EUR":
              response.json({"fulfillmentText": "A conversão do valor $ " + number + " para o Euro ficou de € " + ((number * data.USD.bid)/ data.EUR.bid).toFixed(2)})
              break
            case "JPY":
              response.json({"fulfillmentText": "A conversão do valor $ " + number + " para o Iene Japonês ficou de ¥ " + ((number * data.USD.bid)/ data.JPY.bid).toFixed(2)})
              break
            case "BTC":
              response.json({"fulfillmentText": "A conversão do valor $ " + number + " para o Bitcoin ficou de ฿ " + ((number * data.USD.bid)/ data.BTC.bid)})
              break
          }
        }
        
        if(array[0] == "JPY"){
          switch (array[1]){
            case "BRL":
              response.json({"fulfillmentText": "A conversão do valor ¥ " + number + " para o Real ficou de R$ " + (number * data.JPY.bid).toFixed(2)})
              break
            case "EUR":
              response.json({"fulfillmentText": "A conversão do valor ¥ " + number + " para o Euro ficou de € " + ((number * data.JPY.bid)/ data.EUR.bid).toFixed(2)})
              break
            case "USD":
              response.json({"fulfillmentText": "A conversão do valor ¥ " + number + " para o Dólar Americano ficou de $ " + ((number * data.JPY.bid)/ data.USD.bid).toFixed(2)})
              break
            case "BTC":
              response.json({"fulfillmentText": "A conversão do valor ¥ " + number + " para o Bitcoin ficou de ฿ " + ((number * data.JPY.bid)/ data.BTC.bid)})
              break
          }
        }
        
        if(array[0] == "BTC"){
          switch (array[1]){
            case "BRL":
              response.json({"fulfillmentText": "A conversão do valor ฿ " + number + " para o Real ficou de R$ " + (number * data.BTC.bid).toFixed(2)})
              break
            case "EUR":
              response.json({"fulfillmentText": "A conversão do valor ฿ " + number + " para o Euro ficou de € " + ((number * data.BTC.bid)/ data.EUR.bid).toFixed(2)})
              break
            case "USD":
              response.json({"fulfillmentText": "A conversão do valor ฿ " + number + " para o Dólar Americano ficou de $ " + ((number * data.BTC.bid)/ data.USD.bid).toFixed(2)})
              break
            case "JPY":
              response.json({"fulfillmentText": "A conversão do valor ฿ " + number + " para o Iene Japonês ficou de ¥ " + ((number * data.BTC.bid)/ data.JPY.bid).toFixed(2)})
              break
          }
        }
          
        }
        
      })

    })

  }
  
});


const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
