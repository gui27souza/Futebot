function getNextTuesday() {
    const today = new Date()  // Data atual
    const dayOfWeek = today.getDay()  // Retorna o dia da semana (0=Domingo, 1=Segunda, ..., 6=Sábado)

    // Calcular quantos dias faltam para a próxima terça-feira
    let daysUntilTuesday = (2 - dayOfWeek + 7) % 7  // 2 é o número da terça-feira (0-6)

    // Cria uma nova data com a próxima terça-feira
    const nextTuesday = new Date(today)
    nextTuesday.setDate(today.getDate() + daysUntilTuesday)  // Ajusta a data para a próxima terça

    return {
        dia: nextTuesday.getDate(),
        mes: nextTuesday.getMonth()+1,
        ano: nextTuesday.getFullYear()
    }
}

module.exports = {getNextTuesday}