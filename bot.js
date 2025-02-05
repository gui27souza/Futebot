const { Client, LocalAuth } = require("whatsapp-web.js")
const qrcode = require("qrcode-terminal")

const {getNextTuesday} = require('./getNextTuesday.js')

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

let lista = []
let proxima_terca = getNextTuesday()
let template_lista = `LISTA ${proxima_terca.dia}/${proxima_terca.mes}/${proxima_terca.ano}\n\n`
let numero_jogadores = lista.length + 1
client.on("message", (message) => {
    if (message.body == 'teste') {
        message.reply('teste')
    }
    if (message.body.includes('@5511976641404')) {
        let nome_jogador
        nome_jogador = message.body.replace('@5511976641404', '').trim()
        if (nome_jogador == '') return

        lista.push(nome_jogador)
        template_lista += `${numero_jogadores} - ${nome_jogador}\n`
        numero_jogadores++    
        
        message.reply(template_lista)
    }
})

client.initialize()
