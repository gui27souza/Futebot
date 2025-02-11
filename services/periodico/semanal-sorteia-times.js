// Module and Functions Imports
    const schedule = require('node-schedule')
    const { readConfig } = require('../../util/json-handler')
    const { sorteiaTimes } = require('../lista-service')
// 

// Functions Exports
module.exports = (client) => {

    // Test
    // schedule.scheduleJob('* * * * *', () => sorteiaTimes(client))

    // Every Matchday at 20:55
    const config = readConfig()
    schedule.scheduleJob(`55 20 * * ${config.matchday-1}`, () => sorteiaTimes(client))
}