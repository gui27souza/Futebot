// Module and Functions Imports
    const schedule = require('node-schedule')
    const { readConfig, readLista } = require('../../util/json-handler')
    const { getNextMatchday } = require('../../util/get-next-matchday')
    const { getDate } = require('../../util/get-date')
// 

// Draws Jogadores on Times based on Lista
function sorteiaTimes(client) {

    // Get group chat id
    const config = readConfig()

    // Gets necessary data
    let lista = readLista()
    let lista_jogadores = lista.jogadores
    console.log(lista_jogadores)
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
    let template_times = `TIMES ${matchday.dia}/${matchday.mes}/${matchday.ano}\n\n\n`
    let numero_times = 0
    let jogadores_por_time = 6

    // Defines the number of Times and Jogadores on Times based on total of Jogadores
    switch (true) {
        case (numero_jogadores < 12):
            client.sendMessage(config.id_grupo, "Infelizmente hoje não tem fut 😭"); return; 
        break
        
        case (numero_jogadores == 12): numero_times = 2; break
        case (numero_jogadores == 15): numero_times = 3; jogadores_por_time = 5; break        
        case (numero_jogadores == 20): numero_times = 4; jogadores_por_time = 5; break        
        case (numero_jogadores > 12 && numero_jogadores <= 18): numero_times = 3; break        
        case (numero_jogadores > 18 && numero_jogadores <= 24): numero_times = 4; break        
        case (numero_jogadores > 24 && numero_jogadores <= 30): numero_times = 5; break
    
        default:
            client.sendMessage(config.id_grupo, "Infelizmente hoje não tem fut 😭"); return;
        break
    }

    // Creates the final Lista with drawed Times
    for (let i = 1, jogador_index = 0; i<=numero_times; i++) {
        template_times += `  TIME ${i}\n\n`
        for (let j = 1; j <= jogadores_por_time; j++) {
            console.log(`jogador ${lista_jogadores[jogador_index].nome} foi`)
            template_times += `   ${j} - ${lista_jogadores[jogador_index].nome||''}\n`
            jogador_index++
        }
        template_times += `\n`
    }

    // Send formatted Lista to group chat
    client.sendMessage(config.id_grupo, template_times)

    console.log('\n', getDate(),'  Fez o Sorteio Semanal dos times\n', template_times)
}

// Functions Exports
module.exports = (client) => {

    // Test
    // schedule.scheduleJob('* * * * *', () => sorteiaTimes(client))

    // Every Matchday at 20:55
    const config = readConfig()
    schedule.scheduleJob(`55 20 * * ${config.matchday}`, () => sorteiaTimes(client))
}