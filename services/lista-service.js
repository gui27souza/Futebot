const { getNextTuesday } = require('../util/get-next-tuesday.js')

let lista = []
let proxima_terca = getNextTuesday()
let template_lista = `LISTA ${proxima_terca.dia}/${proxima_terca.mes}/${proxima_terca.ano}\n\n`
let numero_jogadores = lista.length

function adicionarJogadorLista(nome) {
    lista.push(nome)
    numero_jogadores++
    template_lista += `${numero_jogadores} - ${nome} ✅\n`
}

function getLista() {
    return template_lista
}

module.exports = { adicionarJogadorLista, getLista }