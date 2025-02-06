// Functions Imports
    const { getNextTuesday } = require('../util/get-next-tuesday.js')
    const { readLista, updateLista } = require('../util/json-handler.js')
// 

// Add Jogador to Lista
function adicionarJogadorLista(nome) {
    
    // Get Lista object from JSON file
    let lista = readLista()

    // Add Jogador to Lista object
    lista.jogadores.push({
        nome: nome,
        numero: ++lista.numero_jogadores
    })

    // Update JSON file with new Lista object wit new Jogador
    updateLista(lista)
}

// Get formatted Lista with Jogadores in string
function getLista() {

    // Get next tuesday date and uses in Lista template
    let proxima_terca = getNextTuesday()
    let template_lista = `LISTA ${proxima_terca.dia}/${proxima_terca.mes}/${proxima_terca.ano}\n\n`

    // Get Lista object from JSON file
    let lista = readLista()

    // Add each Jogador to Lista template
    lista.jogadores.forEach(jogador => {
        template_lista += `  ${jogador.numero} - ${jogador.nome}\n`
    })

    // Return formatted Lista in string
    return template_lista
}

// Functions Exports
module.exports = { 
    adicionarJogadorLista,
    getLista
}