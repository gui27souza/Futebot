const { readConfig } = require("./json-handler")

// Find the next Matchday date
function getNextMatchday() {

    const config = readConfig()

    const today = new Date()
    const dayOfWeek = today.getDay()

    let daysUntilMatchday = (parseInt(config.matchday) - dayOfWeek + 7) % 7

    const nextMatchday = new Date(today)
    nextMatchday.setDate(today.getDate() + daysUntilMatchday)

    return {
        dia: nextMatchday.getDate(),
        mes: nextMatchday.getMonth()+1,
        ano: nextMatchday.getFullYear()
    }
}

// Functions Exports
module.exports = {
    getNextMatchday
}