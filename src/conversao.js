const MOEDA = require("./moeda");
const CODE_API = MOEDA.CODE_API;
const INPUT_USER = MOEDA.INPUT_USER;
const SYMBOLS = MOEDA.SYMBOLS;

module.exports.conversao = (dataAPI, queryResult) => {
  const parameters = queryResult.parameters;
  const frase = queryResult.queryText;
  const outputParameters = queryResult.outputContexts[0].parameters;

  const originalInputs = INPUT_USER.filter(
    moeda => !!outputParameters[`${moeda}.original`]
  );

  const currency = originalInputs.sort((a, b) => {
    return (
      frase.indexOf(outputParameters[`${a}.original`]) -
      frase.indexOf(outputParameters[`${b}.original`])
    );
  });

  let code1;

  if (currency.length == 1) {
    currency.unshift("real");
    code1 = "BRL";
  } else {
    code1 = parameters[currency[0]];
  }

  let code2 = parameters[currency[1]];

  const number = parameters.number;
  let calculoConversao;
  if (currency[0] == "real") {
    calculoConversao = (number / dataAPI[code2].bid).toFixed(2);
  } else if (currency[1] == "real") {
    calculoConversao = (number * dataAPI[code1].bid).toFixed(2);
    return `A conversão do valor ${SYMBOLS[code1]} ${number} para o Real ficou de ${SYMBOLS[code2]} ${calculoConversao}`;
  } else {
    calculoConversao = (
      (number * dataAPI[code1].bid) /
      dataAPI[code2].bid
    ).toFixed(2);
  }

  return `A conversão do valor ${SYMBOLS[code1]} ${number} para o ${dataAPI[code2].name} ficou de ${SYMBOLS[code2]} ${calculoConversao}`;
};
