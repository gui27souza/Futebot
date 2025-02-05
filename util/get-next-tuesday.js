function getNextTuesday() {
    const today = new Date()
    const dayOfWeek = today.getDay()

    let daysUntilTuesday = (2 - dayOfWeek + 7) % 7

    const nextTuesday = new Date(today)
    nextTuesday.setDate(today.getDate() + daysUntilTuesday)

    return {
        dia: nextTuesday.getDate(),
        mes: nextTuesday.getMonth()+1,
        ano: nextTuesday.getFullYear()
    }
}

module.exports = {getNextTuesday}