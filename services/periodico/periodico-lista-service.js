// Modules and Functions Import
    const schedule = require('node-schedule')

    const { readConfig } = require('../../util/json-handler')
    const { getLista } = require('../lista-service')
//

// Send Lista to group chat
function enviarLista(client) {
    // Get group chat id
    const config = readConfig()
    // Get formatted Lista
    const mensagem = getLista()
    // Send formatted Lista to group chat
    client.sendMessage(config.id_grupo, mensagem)
}

// Functions Exports
module.exports = (client) => {

    // Test
    // schedule.scheduleJob('* * * * *', () => enviarLista(client))

    // Tuesday each 30min (08:00 - 20:00)
    schedule.scheduleJob('*/30 8-20 * * 2', () => enviarLista(client))

    // Sunday and Monday each 1h (08:00 - 20:00)
    schedule.scheduleJob('0 8-20/1 * * 0,1', () => enviarLista(client))

    // Friday and Saturday each 3h (08:00 - 20:00)
    schedule.scheduleJob('0 8-20/3 * * 5,6', () => enviarLista(client))
}
