// Functions Imports
    const { getNextMatchday } = require('../util/get-next-matchday.js')
    const { getDate } = require('../util/get-date.js')
    const { readLista, updateLista, readConfig } = require('../util/json-handler.js')
// 

// Add Jogador to Lista
function adicionarJogadorLista(nome) {
    
    // Get Lista object from JSON file
    let lista = readLista()

    // Add Jogador to Lista object
    lista.jogadores.push({
        nome: nome,
    })
    lista.numero_jogadores++

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
    lista.numero_naovai++

    // Update JSON file with new Lista object with new NaoVai
    updateLista(lista)
}

// Remove specified Jogador of Lista
function removeJogador(nome) {

    // Get Lista object from JSON file
    let lista = readLista()

    // Runs through the array of Jogadores
    let achou_removeu = false
    for (let i = 0; i < lista.numero_jogadores; i++) {
        if (lista.jogadores[i].nome == nome) {
            lista.jogadores.splice(i, 1)
            lista.numero_jogadores--
            achou_removeu = true
            updateLista(lista)
            break
        }
    }

    // Return if it was successfull or not
    return achou_removeu
}

// Remove specified NaoVai of Lista
function removeNaoVai(nome) {

    // Get Lista object from JSON file
    let lista = readLista()

    // Runs through the array of NaoVai
    let achou_removeu = false
    for (let i = 0; i < lista.numero_naovai; i++) {
        if (lista.nao_vai[i].nome == nome) {
            lista.nao_vai.splice(i, 1)
            lista.numero_naovai--
            achou_removeu = true
            updateLista(lista)
            break
        }
    }

    // Return if it was successfull or not
    return achou_removeu
}

// Remove last Jogador from Lista
function removeLastJogador() {

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
    lista.numero_naovai--

    // Update JSON file with new Lista object
    updateLista(lista)
}

// Get formatted Lista with Jogadores in string
function getLista() {

    // Get Config and Lista objects from JSON files
    const config = readConfig()
    let lista = readLista()

    // Get next Matchday date and uses in Lista template
    let matchday = getNextMatchday()
    let template_lista = `\nLISTA ${matchday.dia}/${matchday.mes}/${matchday.ano}\n${config.message_template.head}\n\n`

    // Add each Jogador to Lista template
    let i = 1
    lista.jogadores.forEach(jogador => {
        if (i<10) template_lista += '  '
        template_lista += `  ${i++} - ${jogador.nome}\n`
    })
    
    template_lista += '\n'+config.message_template.nao_vai+'\n'


    // Add each Jogador to Lista template
    lista.nao_vai.forEach(nao_vai => {
        template_lista += ` ${nao_vai.nome} ❌\n`
    })

    template_lista += '\n'+config.message_template.bottom

    // Return formatted Lista in string
    return template_lista
}

// Draws Jogadores on Times based on Lista
function sorteiaTimes(client, group_id) {

    console.log('\n', getDate(), 'Iniciando sorteio de times\n')

    // Get group chat id
    const config = readConfig()
    if (!group_id) group_id = config.id_grupo

    // Gets necessary data
    let lista = readLista()
    let lista_jogadores = lista.jogadores
    const numero_jogadores = lista.numero_jogadores

    // Randomize array of Jogadores
    for (let i = numero_jogadores-1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1))
        var temp = lista_jogadores[i]
        lista_jogadores[i] = lista_jogadores[j]
        lista_jogadores[j] = temp
    }

    // Creates template for drawed Times
    let matchday = getNextMatchday()
    let template_times = `TIMES ${matchday.dia}/${matchday.mes}/${matchday.ano}\n\n`
    let numero_times = 0
    let jogadores_por_time = 6

    // Defines the number of Times and Jogadores on Times based on total of Jogadores
    switch (true) {
        case (numero_jogadores < 12):
            client.sendMessage(group_id, "Sem Jogadores o suficiente\nInfelizmente hoje não tem fut 😭")
            console.log('\n', getDate(),'  Não fez o Sorteio dos times: SEM JOGADORES SUFICIENTES\n', template_times)
            return
        break
        
        case (numero_jogadores == 12): numero_times = 2; break
        case (numero_jogadores == 15): numero_times = 3; jogadores_por_time = 5; break        
        case (numero_jogadores == 20): numero_times = 4; jogadores_por_time = 5; break        
        case (numero_jogadores > 12 && numero_jogadores <= 18): numero_times = 3; break        
        case (numero_jogadores > 18 && numero_jogadores <= 24): numero_times = 4; break        
        case (numero_jogadores > 24 && numero_jogadores <= 30): numero_times = 5; break
    
        default:
            client.sendMessage(group_id, "Sem Jogadores o suficiente\nInfelizmente hoje não tem fut 😭")
            console.log('\n', getDate(),'    Não fez o Sorteio dos times: SEM JOGADORES SUFICIENTES\n', template_times)
            return
        break
    }

    // Creates the final Lista with drawed Times
    for (let i = 1, jogador_index = 0; i<=numero_times; i++) {
        console.log('    TIME', i)
        template_times += `  *TIME ${i}*\n\n`
        for (let j = 1; j <= jogadores_por_time; j++) {
            if (lista_jogadores[jogador_index] == undefined) {
                template_times += `   ${j} -\n`
                console.log(`    Espaço livre incluido no time ${i}`)
            } else {
                console.log(`    Jogador ${lista_jogadores[jogador_index].nome} foi incluido no time ${i}`)
                template_times += `   ${j} - ${lista_jogadores[jogador_index].nome||''}\n`
                jogador_index++
            }
        }
        if (i != numero_times) console.log('    -----')
        template_times += `\n`
    }

    console.log('\n', getDate(),'  Fez o Sorteio dos times')

    // Send formatted Lista to group chat
    client.sendMessage(group_id, template_times)
}

// Functions Exports
module.exports = { 
    adicionarJogadorLista,
    adicionarNaoVai,
    removeJogador,
    removeNaoVai,
    removeLastJogador,
    removeLastNaoVai,
    getLista,
    sorteiaTimes
}