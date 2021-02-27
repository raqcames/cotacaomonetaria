const MOEDA = require('./moeda')
const CODE_API = MOEDA.CODE_API
const INPUT_USER = MOEDA.INPUT_USER
const SYMBOLS = MOEDA.SYMBOLS

module.exports = (dataAPI, requestParams) => {
    const moedaFiltrada = INPUT_USER.filter(moeda => !!requestParams[moeda])
    let cotacao = "Aqui vão as cotações do dia 😉 \n \n";

    (moedaFiltrada.length ? moedaFiltrada : CODE_API).forEach(coinCode => {
        cotacao += `✔️ ${dataAPI[coinCode].name}: ${SYMBOLS[coinCode]} ${dataAPI[coinCode].bid} \n`
    })

    return `${cotacao} \n \nPosso ajudar em mais alguma coisa? 🤔`
}