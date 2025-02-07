function getDate() {
    let agora = new Date()

    let dia = agora.getDate()
    let mes = agora.getMonth() + 1
    let ano = agora.getFullYear()
    let horas = agora.getHours()
    let minutos = agora.getMinutes()
    let segundos = agora.getSeconds()

    // Formatando para exibição
    let dataFormatada = `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}\n`

    return dataFormatada
}

module.exports = {
    getDate
}