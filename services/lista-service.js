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

    // Update JSON file with new Lista object with new Jogador
    updateLista(lista)
}

// Add NaoVai to Lista
function adicionarNaoVai(nome) {

    // Get Lista object from JSON file
    let lista = readLista()

    // Add NaoVai to Lista object
    lista.nao_vai.push({
        nome: nome,
    })

    // Update JSON file with new Lista object with new NaoVai
    updateLista(lista)
}

// Remove last Jogador from Lista
function removeLast() {

    // Get Lista object from JSON file
    let lista = readLista()

    lista.jogadores.pop()
    lista.numero_jogadores--

    // Update JSON file with new Lista object
    updateLista(lista)
}

// Remove last NaoVai from Lista
function removeLastNaoVai() {

    // Get Lista object from JSON file
    let lista = readLista()

    lista.nao_vai.pop()

    // Update JSON file with new Lista object
    updateLista(lista)
}

// Get formatted Lista with Jogadores in string
function getLista() {

    // Get next tuesday date and uses in Lista template
    let proxima_terca = getNextTuesday()
    let template_lista = `\nLISTA ${proxima_terca.dia}/${proxima_terca.mes}/${proxima_terca.ano}\nDIA DE PAGAR A QUADRA\nPIX (11)97494-3376\n\nTIME - 21:00 às 23:00\n\n`

    // Get Lista object from JSON file
    let lista = readLista()

    // Add each Jogador to Lista template
    lista.jogadores.forEach(jogador => {
        template_lista += `  ${jogador.numero} - ${jogador.nome}\n`
    })
    
    template_lista += '\n❌ AUSENTES ❌\n'

    // Add each Jogador to Lista template
    lista.nao_vai.forEach(nao_vai => {
        template_lista += ` ${nao_vai.nome} ❌\n`
    })    

    // Return formatted Lista in string
    return template_lista
}

// Functions Exports
module.exports = { 
    adicionarJogadorLista,
    adicionarNaoVai,
    removeLast,
    removeLastNaoVai,
    getLista
}