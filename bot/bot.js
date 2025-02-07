// Module Imports
    const { Client, LocalAuth } = require("whatsapp-web.js")
    const qrcode = require("qrcode-terminal")
// 

// Functions Imports
    const { readConfig, updateConfig, readLista, updateLista } = require('../util/json-handler.js')
    const { adicionarJogadorLista, getLista, adicionarNaoVai, removeLast, removeLastNaoVai } = require("../services/lista-service.js")

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
        qrcode.generate(qr, { small: true })
    })
//

// Bot Setup and Schedule Functions Setup
client.on("ready", () => {
    console.log("Bot conectado!")

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
    if (message.body == 'teste') {
        message.reply('teste')
        return
    }

    // Stores the ID of the group chat, used for the scheduled functions
    if (config.id_grupo == 'none')
    if (message.from.includes('@g.us')) {
        config.id_grupo = message.from
        updateConfig(config)
    }

    // Get Lista Command
    if (message.body == '@5511976641404 lista') {
        message.reply(getLista())
        return
    }

    // Reset Lista Command
    if (message.body == '@5511976641404 reset lista') {
        let lista = {
            "jogadores": [
            ],
            "numero_jogadores": 0
        }
        updateLista(lista)
        message.reply(getLista())
    // Remove Jogador of Lista
    if (message.body == '@5511976641404 rmLastJogador ') {
        removeLast()
        message.reply(getLista())
        console.log('\nRemoveu ultimo jogador adicionado')
        return
    }

    // Remove NaoVai of Lista
    if (message.body == '@5511976641404 rmLastNaoVai ') {
        removeLastNaoVai()
        message.reply(getLista())
        console.log('\nRemoveu ultimo naovai adicionado')
        return
    }
    
    // Add NaoVai to Lista
    if (message.body.includes('@5511976641404 não ')) {
        
        let nome_naovai = message.body.replace('@5511976641404 não ', '').trim()
        if (nome_naovai == '') return

        adicionarNaoVai(nome_naovai)

        message.reply(getLista())
        console.log('\nAdicionou jogador que nao vai a lista')
        return
    }

    // Add Jogador to Lista
    if (message.body.includes('@5511976641404')) {
        
        let nome_jogador
        nome_jogador = message.body.replace('@5511976641404', '').trim()
        if (nome_jogador == '') return

        adicionarJogadorLista(nome_jogador)
        
        message.reply(getLista())
    }

})

// Main Function
client.initialize()