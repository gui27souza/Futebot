// Modules and Functions Import
    const schedule = require('node-schedule')

    const { readConfig } = require('../../util/json-handler')
    const { getLista } = require('../lista-service')
    const { getDate } = require('../../util/get-date')
//

// Send Lista to group chat
function enviarLista(client) {
    // Get group chat id
    const config = readConfig()
    // Get formatted Lista
    const mensagem = getLista()
    // Send formatted Lista to group chat
    client.sendMessage(config.id_grupo, mensagem)
    console.log('\n', getDate(), '  Enviou a Lista no horario marcado')
}

// Functions Exports
module.exports = (client) => {

    // Test
    // schedule.scheduleJob('* * * * *', () => enviarLista(client))

    // Tuesday each 2h (08:00 - 20:00)
    schedule.scheduleJob('0 8-20/2 * * 2', () => enviarLista(client))

    // Sunday and Monday each 4h (08:00 - 20:00)
    schedule.scheduleJob('0 8-20/4 * * 0,1', () => enviarLista(client))

    // Friday and Saturday each 4h (08:00 - 20:00)
    schedule.scheduleJob('0 8-20/4 * * 5,6', () => enviarLista(client))
}
