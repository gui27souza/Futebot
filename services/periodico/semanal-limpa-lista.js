const schedule = require('node-schedule')
const { updateLista } = require('../../util/json-handler')

class ScheduleLimpaLista {
    constructor(callback) {
        this.callback = callback
    }

    start() {
        schedule.scheduleJob('0 0 * * 4', () => {
            this.callback()
        })
    }
}

module.exports = ScheduleLimpaLista