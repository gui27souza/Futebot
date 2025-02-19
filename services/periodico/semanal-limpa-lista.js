// Module and Functions Imports
    const schedule = require('node-schedule')

    const { updateLista, readConfig } = require('../../util/json-handler')
    const { getDate } = require('../../util/get-date')
// 

// Resets Lista
function limpaLista() {
    // New clean object
    let lista = {
        "jogadores": [],
        "numero_jogadores": 0,
        "nao_vai": [],
        "numero_naovai": 0
    }
    // Update the JSON file with clean object
    updateLista(lista)

    console.log('\n', getDate(), '  Fez a limpeza semanal da lista')
}

// Functions Exports
module.exports = (client) => {
    // Every following matchay day at 00:00
    const config = readConfig()
    if (config.matchday == 7) config.matchday = 0 
    schedule.scheduleJob(`0 0 0 * * ${parseInt(config.matchday)}`, () => limpaLista())
}