const { getNextTuesday } = require('../util/get-next-tuesday.js')

const { readConfig, updateConfig, readLista, updateLista } = require('../util/json-handler.js')

function adicionarJogadorLista(nome) {
    let lista = readLista()
    lista.jogadores.push({
        nome: nome,
        numero: ++lista.numero_jogadores
    })
    updateLista(lista)
}

function getLista() {
    let proxima_terca = getNextTuesday()
    let template_lista = `LISTA ${proxima_terca.dia}/${proxima_terca.mes}/${proxima_terca.ano}\n\n`

    let lista = readLista()

    lista.jogadores.forEach(jogador => {
        template_lista += `  ${jogador.numero} - ${jogador.nome}\n`
    })

    return template_lista
}

function limpaLista() {
    let lista = {
        "jogadores": [
        ],
        "numero_jogadores": 0
    }
    updateLista(lista)
}

module.exports = { adicionarJogadorLista, getLista, limpaLista }