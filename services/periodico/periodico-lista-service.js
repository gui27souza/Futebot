const schedule = require('node-schedule')
const { readConfig } = require('../../util/json-handler')
const { getLista } = require('../lista-service')

module.exports = (client) => {

    const config = readConfig()

    const enviarMensagem = () => {
        const mensagem = getLista()
        client.sendMessage(config.id_grupo, mensagem)
    }

    // Teste
    // schedule.scheduleJob('* * * * *', enviarMensagem)

    // Terça-feira a cada 30 minutos (08:00 - 20:00)
    schedule.scheduleJob('*/30 8-20 * * 2', enviarMensagem)

    // Domingo e segunda a cada 1 hora (08:00 - 20:00)
    schedule.scheduleJob('0 8-20/1 * * 0,1', enviarMensagem)

    // Sexta e sábado a cada 3 horas (08:00 - 20:00)
    schedule.scheduleJob('0 8-20/3 * * 5,6', enviarMensagem)
}
