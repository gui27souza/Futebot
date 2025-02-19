// Module and Functions Imports
    const schedule = require('node-schedule')
    const { readConfig } = require('../../util/json-handler')
    const { sorteiaTimes } = require('../lista-service')
// 

// Functions Exports
module.exports = (client) => {

    const config = readConfig()

    // Every Matchday
    schedule.scheduleJob(`55 20 * * ${parseInt(config.matchday)-1}`, () => sorteiaTimes(client, config.id_grupo))
}