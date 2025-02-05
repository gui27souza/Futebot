const { Client, LocalAuth } = require("whatsapp-web.js")
const qrcode = require("qrcode-terminal")

const { readConfig, updateConfig, readLista, updateLista } = require('../util/json-handler.js')

const { adicionarJogadorLista, getLista, limpaLista } = require("../services/lista-service.js")

let config = readConfig()

const client = new Client({
    authStrategy: new LocalAuth()
})

client.on("qr", (qr) => {
    console.log("Escaneie o QR Code abaixo:")
    qrcode.generate(qr, { small: true })
})

client.on("ready", () => {
    console.log("Bot conectado!")
})

client.on("message", (message) => {
    
    if (message.body == 'teste') {
        message.reply('teste')
        message.reply(config)
    }

    if (config.id_grupo == 'none')
    if (message.from.includes('@g.us')) {
        config.id_grupo = message.from
        updateConfig(config)
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