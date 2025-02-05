const schedule = require('node-schedule')
const { updateLista } = require('../../util/json-handler')

function limpaLista() {
    let lista = {
        "jogadores": [
        ],
        "numero_jogadores": 0
    }
    updateLista(lista)
}

module.exports = (client) => { 
    schedule.scheduleJob('0 0 * * 4', limpaLista)
}