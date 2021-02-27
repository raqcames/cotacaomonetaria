import { CODE_API, INPUT_USER, SYMBOLS } from './moeda';

export const conversao = (dataAPI, queryResult) => {
    
    const parameters = queryResult.parameters
    const frase = queryResult.queryText
  
    const originalInputs = INPUT_USER.filter(moeda => !!parameters[`${moeda}.original`])

    const currency = originalInputs.sort((a, b) => {
        return frase.indexOf(parameters[`${a}.original`]) - frase.indexOf(parameters[`${b}.original`])
    })

    if (currency.length == 1) {
        currency.unshift('real')
    }

    const code1 = parameters[currency[0]]
    const code2 = parameters[currency[1]]

    const number = parameters.number
    let calculoConversao
    if (currency[0] == 'real') {
        calculoConversao = (number / dataAPI[code2].bid)
    } else if (currency[1] == 'real') {
        calculoConversao = (number * dataAPI[code1].bid)
    } else {
        calculoConversao = ((number * dataAPI[code1].bid) / dataAPI[code2].bid)
    }

    return `A conversão do valor ${SYMBOLS[code1]} ${number} para o ${dataAPI[code2].name} ficou de ${SYMBOLS[code2]} ${calculoConversao}`
}