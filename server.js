const conversao = require("./src/conversao").conversao
const cotacao = require("./src/cotacao").cotacao
const get = require("./src/util").get

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/Dialogflow", async function ({ body: { queryResult } }, response) {
    var intentName = queryResult.intent.displayName;

    const data = await get("https://economia.awesomeapi.com.br/json/all")

    const Intents = {
        Cotacao: () => cotacao(data, queryResult.parameters),
        Conversao: () => conversao(data, queryResult),
    }

    response.json({ fulfillmentText: Intents[intentName]() })
});

const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
});
