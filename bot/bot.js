// Module Imports
    const { Client, LocalAuth } = require("whatsapp-web.js")
    const qrcode = require("qrcode-terminal")
// 

// Functions Imports
    const { getDate } = require("../util/get-date.js")
    const { readConfig, updateConfig, readLista, updateLista } = require('../util/json-handler.js')
    const { adicionarJogadorLista, getLista, adicionarNaoVai, removeLastJogador, removeLastNaoVai, removeJogador } = require("../services/lista-service.js")

    const scheduleEnviaLista = require('../services/periodico/periodico-lista-service.js')
    const scheduleLimpaLista = require('../services/periodico/semanal-limpa-lista.js')
    const scheduleSorteiaTimes = require('../services/periodico/semanal-sorteia-times.js')
// 

// Client Auth
    const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-accelerated-video-decode',
                '--disable-accelerated-mjpeg-decode',
                '--disable-software-rasterizer',
                '--no-zygote',
                '--single-process'
            ]
        }
    })


    client.on("qr", (qr) => {
        console.log("Escaneie o QR Code abaixo:")
        qrcode.generate(qr, { small: false })
    })
//

// Bot Setup and Schedule Functions Setup
client.on("ready", () => {
    console.log('\n', getDate(), '  Bot conectado!')

    // Daily/Hourly Get Lista Function
    scheduleEnviaLista(client)
    // Weekly Clear Lista Function
    scheduleLimpaLista(client)
    // Weekly Draw Times from Lista
    scheduleSorteiaTimes(client)
})

// Message Listener
client.on("message", (message) => {
    
    let config = readConfig()

    // Dev test
    if (message.body == '@5511976641404 teste' && message.author === '5511980640455@c.us') {
        message.reply('teste')
        console.log('\n', getDate(), '  teste ')
        return
    }
    
    // Stores the ID of the group chat, used for the scheduled functions
    if (config.id_grupo == 'none')
    if (message.from.includes('@g.us')) {
        config.id_grupo = message.from
        updateConfig(config)
        console.log('\n', getDate(), '  ID do Grupo obtido: ', config.id_grupo)
    }

    if (message.body == '@5511976641404 help') {
        message.reply("*COMANDOS* \n\nadd - adiciona o nome na lista\nnão - adiciona o nome que não vai\n\nshowLista - Mostra a lista da semana\n\nrmLastJogador - apaga o último nome da lista\nrmLastNaoVai - apaga o último nome da lista de quem não vai\n\nresetLista - reseta a lista da semana\n")
        console.log('\n', getDate(), '  Enviou help')
        return
    }

    // Get Lista Command
    if (message.body == '@5511976641404 showLista') {
        message.reply(getLista())
        console.log('\n', getDate(), '  Enviou lista a pedido de usuário')
        return
    }

    // Reset Lista Command
    if (message.body == '@5511976641404 resetLista' && message.author === '5511980640455@c.us') {
        let lista = {
            "jogadores": [
            ],
            "numero_jogadores": 0,
            "nao_vai": [

            ]
        }
        updateLista(lista)
        message.reply(getLista())
        console.log('\n', getDate(), '  Resetou lista a pedido de usuário')
        return
    }

    // Remove specified Jogador of Lista
    if (message.body == '@5511976641404 rmJogador ') {
        
        let nome_jogador = message.body.replace('@5511976641404 rmJogador ', '').trim()
        if (nome_jogador == '') return

        let achou_removeu = removeJogador(nome_jogador)

        if(achou_removeu) {
            message.reply(getLista())
            console.log('\n', getDate(), `  Removeu jogador ${nome_jogador.toUpperCase()} a pedido de ${message._data.notifyName.toUpperCase()}`)
        } else {
            message.reply(`Jogador ${nome_jogador} não esta na lista 🧐!!`)
            console.log('\n', getDate(), `  Não removeu ${nome_jogador.toUpperCase()} a pedido de ${message._data.notifyName.toUpperCase()}: NAO ESTA NA LISTA`)
        }
    }

    // Remove last Jogador of Lista
    if (message.body == '@5511976641404 rmLastJogador') {
        removeLastJogador()
        message.reply(getLista())
        console.log('\n', getDate(), '  Removeu ultimo jogador adicionado')
        return
    }

    // Remove last NaoVai of Lista
    if (message.body == '@5511976641404 rmLastNaoVai') {
        removeLastNaoVai()
        message.reply(getLista())
        console.log('\n', getDate(), '  Removeu ultimo naovai adicionado')
        return
    }
    
    // Add NaoVai to Lista
    if (message.body.includes('@5511976641404 não ')) {
        
        let nome_naovai = message.body.replace('@5511976641404 não ', '').trim()
        if (nome_naovai == '') return

        adicionarNaoVai(nome_naovai)

        message.reply(getLista())
        console.log('\n', getDate(), '  Adicionou jogador que nao vai a lista')
        return
    }

    // Add Jogador to Lista
    if (message.body.includes('@5511976641404 add ')) {
        
        let nome_jogador = message.body.replace('@5511976641404 add ', '').trim()
        if (nome_jogador == '') return

        adicionarJogadorLista(nome_jogador)
        
        message.reply(getLista())
        console.log('\n', getDate(), '  Adicionou jogador a lista')
        return
    } 

})

// Main Function
client.initialize()