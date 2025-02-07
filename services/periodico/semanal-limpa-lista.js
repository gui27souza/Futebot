// Module and Functions Imports
    const schedule = require('node-schedule')

    const { updateLista } = require('../../util/json-handler')
// 

// Resets Lista
function limpaLista() {
    // New clean object
    let lista = {
        "jogadores": [],
        "numero_jogadores": 0,
        "nao_vai": []
    }
    // Update the JSON file with clean object
    updateLista(lista)

    console.log('Fez a limpeza semanal da lista')
}

// Functions Exports
module.exports = (client) => {
    // Every Wednesday at 00:00
    schedule.scheduleJob('0 0 * * 4', limpaLista)
}