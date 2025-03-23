// Functions Imports
    const { getNextMatchday } = require('../util/get-next-matchday.js')
    const { getDate } = require('../util/get-date.js')
    const { readLista, updateLista, readConfig } = require('../util/json-handler.js')
// 

function addToLista(nome, key, countkey) {

    if (key != 'duvida') {
        removeFromLista(nome, 'duvida', 'numero_duvida')
    }

    // Get Lista object from JSON file
    let lista = readLista()
    
    // Add Jogador to Lista object
    lista[key].push({
        nome: nome
    })
    lista[countkey]++

    // Update JSON file with new Lista object with new Element
    updateLista(lista)

}

// Remove <type> from Lista generic function
function removeFromLista(nome, key, countkey) {

    // Get Lista object from JSON file
    let lista = readLista()

    // Runs through the array of jogador
    let achou_removeu = false
    for (let i = 0; i < lista[countkey]; i++) {
        if (lista[key][i].nome == nome) {
            lista[key].splice(i, 1)
            lista[countkey]--
            achou_removeu = true
            break
        }
    }
    
    if (achou_removeu) updateLista(lista)

    // Return if it was successfull or not
    return achou_removeu
}

// Get formatted Lista with jogador in string
function getLista() {

    // Get Config and Lista objects from JSON files
    const config = readConfig()
    let lista = readLista()

    // Get next Matchday date and uses in Lista template
    let matchday = getNextMatchday()
    let template_lista = `\nLISTA ${matchday.dia}/${matchday.mes}/${matchday.ano}\n${config.message_template.head}`

    // Add each Jogador to Lista template
    template_lista += '\n'+config.message_template.jogador+'\n'
    let i = 1
    lista.jogador.forEach(jogador => {
        if (i<10) template_lista += '  '
        template_lista += `  ${i++} - ${jogador.nome}\n`
    })
    
    // Add each Goleiro to Lista template
    template_lista += '\n'+config.message_template.goleiro+'\n'
    i = 1
    lista.goleiro.forEach(goleiro => {
        template_lista += `  ${i++} - ${goleiro.nome} 🥅\n`
    })
    
    // Add each Duvida to Lista template
    template_lista += '\n'+config.message_template.duvida+'\n'
    lista.duvida.forEach(duvida => {
        template_lista += ` ${duvida.nome} ❓\n`
    })
    
    // Add each Ausente to Lista template
    template_lista += '\n'+config.message_template.ausente+'\n'
    lista.ausente.forEach(ausente => {
        template_lista += ` ${ausente.nome} ❌\n`
    })

    template_lista += '\n'+config.message_template.bottom

    // Return formatted Lista in string
    return template_lista
}

// Draws jogador on Times based on Lista
function sorteiaTimes(client, group_id) {

    console.log('\n', getDate(), 'Iniciando sorteio de times\n')

    // Get group chat id
    const config = readConfig()
    if (!group_id) group_id = config.id_grupo

    // Gets necessary data
    let lista = readLista()
    let lista_jogador = lista.jogador
    let numero_jogador = lista.numero_jogador
    console.log(numero_jogador)

    // Randomize array of jogador
    for (let i = numero_jogador-1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1))
        var temp = lista_jogador[i]
        lista_jogador[i] = lista_jogador[j]
        lista_jogador[j] = temp
    }

    // Creates template for drawed Times
    let matchday = getNextMatchday()
    let template_times = `TIMES ${matchday.dia}/${matchday.mes}/${matchday.ano}\n\n`
    let numero_times = 0
    let jogador_por_time = 6
    numero_jogador += lista.numero_goleiro

    // Defines the number of Times and jogador on Times based on total of jogador
    switch (true) {
        case (numero_jogador < 10):
            client.sendMessage(group_id, "Sem jogador o suficiente\nInfelizmente hoje não tem fut 😭")
            console.log('\n', getDate(),'  Não fez o Sorteio dos times: SEM jogador SUFICIENTES\n', template_times)
            return
        break
        
        case (numero_jogador == 10): numero_times = 2; break
        case (numero_jogador == 11): numero_times = 3; jogador_por_time = 5; break
        case (numero_jogador == 12): numero_times = 2; break
        case (numero_jogador == 15): numero_times = 3; jogador_por_time = 5; break        
        case (numero_jogador == 20): numero_times = 4; jogador_por_time = 5; break        
        case (numero_jogador > 12 && numero_jogador <= 18): numero_times = 3; break        
        case (numero_jogador > 18 && numero_jogador <= 24): numero_times = 4; break        
        case (numero_jogador > 24 && numero_jogador <= 30): numero_times = 5; break
    
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

        let j = 1
        if (lista.goleiro[i-1] != undefined) {
            console.log(`    Goleiro ${lista.goleiro[i-1].nome} foi incluido no time ${i}`)
            template_times += `   ${j} - ${lista.goleiro[i-1].nome} 🥅\n`
            j++
        }
        for (; j <= jogador_por_time; j++) {
            if (lista_jogador[jogador_index] == undefined) {
                template_times += `   ${j} -\n`
                console.log(`    Espaço livre incluido no time ${i}`)
            } else {
                console.log(`    Jogador ${lista_jogador[jogador_index].nome} foi incluido no time ${i}`)
                template_times += `   ${j} - ${lista_jogador[jogador_index].nome||''}\n`
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
    addToLista,

    removeFromLista,

    getLista,

    sorteiaTimes
}