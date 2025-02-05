// Module Imports
    const { Client, LocalAuth } = require("whatsapp-web.js")
    const qrcode = require("qrcode-terminal")
// 

// Functions Imports
    const { readConfig, updateConfig, readLista, updateLista } = require('../util/json-handler.js')
    const { adicionarJogadorLista, getLista } = require("../services/lista-service.js")

    const scheduleLimpaLista = require('../services/periodico/semanal-limpa-lista.js')
    const scheduleEnviaLista = require('../services/periodico/periodico-lista-service.js')
// 

// Client Auth
    const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            args: ['--no-sandbox', '--disable-setuid-sandbox']
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

    scheduleEnviaLista(client)
    scheduleLimpaLista(client)
})

// Message Listener
client.on("message", (message) => {
    
    let config = readConfig()
    
    if (message.body == 'teste') {
        message.reply('teste')
        return
    }

    if (config.id_grupo == 'none')
    if (message.from.includes('@g.us')) {
        config.id_grupo = message.from
        updateConfig(config)
    }

    if (message.body == '@5511976641404 lista') {
        message.reply(getLista())
        return
    }

    if (message.body == '@5511976641404 reset lista') {
        let lista = {
            "jogadores": [
            ],
            "numero_jogadores": 0
        }
        updateLista(lista)
        message.reply(getLista())
        return
    }

    if (message.body.includes('@5511976641404')) {
        
        let nome_jogador
        nome_jogador = message.body.replace('@5511976641404', '').trim()
        if (nome_jogador == '') return

        adicionarJogadorLista(nome_jogador)
        
        message.reply(getLista())
    }
})

client.initialize()