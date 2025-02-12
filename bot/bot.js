// Module Imports
    const { Client, LocalAuth } = require("whatsapp-web.js")
    const qrcode = require("qrcode-terminal")
// 

// Functions Imports
    const { getDate } = require("../util/get-date.js")
    const { readConfig, updateConfig, readLista, updateLista } = require('../util/json-handler.js')
    const { adicionarJogadorLista, getLista, adicionarNaoVai, removeLastJogador, removeLastNaoVai, removeJogador, removeNaoVai, sorteiaTimes } = require("../services/lista-service.js")

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
    // console.log(config)

    // Stores the ID of the group chat, used for the scheduled functions
    if (config.id_grupo === null)
    if (message.from.includes('@g.us')) {
        config.id_grupo = message.from
        updateConfig(config)
        console.log('\n', getDate(), '  ID do Grupo obtido: ', config.id_grupo)
    }

    // Dev test
    if (message.body == `@${config.bot_number} teste` && config.admin_number.includes(message.author)) {
        message.reply('teste')
        console.log('\n', getDate(), '  teste ')
        return
    }

    // Get Commands list
    if (message.body == `@${config.bot_number} help`) {
        message.reply("*COMANDOS* \n\nadd - adiciona o nome na lista\nnão - adiciona o nome que não vai\n\nshowLista - Mostra a lista da semana\n\nrmJogador - apaga o jogador\nrmNaoVai - remove o que não vai\nrmLastJogador - apaga o último nome da lista\nrmLastNaoVai - apaga o último nome da lista de quem não vai\n\nresetLista - reseta a lista da semana (admin only)\n")
        console.log('\n', getDate(), '  Enviou help a pedido de usuario ', message._data.notifyName.toUpperCase())
        return
    }

    // Get Lista Command
    if (message.body == `@${config.bot_number} showLista`) {
        message.reply(getLista())
        console.log('\n', getDate(), '  Enviou lista a pedido de usuário ', message._data.notifyName.toUpperCase())
        return
    }

    // Reset Lista Command
    if (message.body == `@${config.bot_number} resetLista` && config.admin_number.includes(message.author)) {
        let lista = {
            "jogadores": [],
            "numero_jogadores": 0,
            "nao_vai": [],
            "numero_naovai": 0
        }
        updateLista(lista)
        message.reply(getLista())
        console.log('\n', getDate(), '  Resetou lista a pedido de usuário ', message._data.notifyName.toUpperCase())
        return
    }

    if (message.body == `@${config.bot_number} drawTimes` && config.admin_number.includes(message.author)) {
        sorteiaTimes(client, message.from)
        return
    }


    // Remove specified Jogador of Lista
    if (message.body.includes(`@${config.bot_number} rmJogador `)) {
        
        let nome_jogador = message.body.replace(`@${config.bot_number} rmJogador `, '').trim()
        if (nome_jogador == '') return

        let achou_removeu = removeJogador(nome_jogador)

        if(achou_removeu) {
            message.reply(getLista())
            console.log('\n', getDate(), `  Removeu jogador ${nome_jogador.toUpperCase()} a pedido de ${message._data.notifyName.toUpperCase()}`)
        } else {
            message.reply(`Jogador ${nome_jogador} não esta na lista 🧐!!`)
            console.log('\n', getDate(), `  Não removeu ${nome_jogador.toUpperCase()} a pedido de ${message._data.notifyName.toUpperCase()}: NAO ESTA NA LISTA`)
        }

        return
    }

    // Remove specified NaoVai of Lista
    if (message.body.includes(`@${config.bot_number} rmNaoVai `)) {
        
        let nome_naovai = message.body.replace(`@${config.bot_number} rmNaoVai `, '').trim()
        if (nome_naovai == '') return

        let achou_removeu = removeNaoVai(nome_naovai)

        if(achou_removeu) {
            message.reply(getLista())
            console.log('\n', getDate(), `  Removeu naovai ${nome_naovai.toUpperCase()} a pedido de ${message._data.notifyName.toUpperCase()}`)
        } else {
            message.reply(`NaoVai ${nome_naovai} não esta na lista 🧐!!`)
            console.log('\n', getDate(), `  Não removeu ${nome_naovai.toUpperCase()} a pedido de ${message._data.notifyName.toUpperCase()}: NAO ESTA NA LISTA`)
        }

        return
    }

    // Remove last Jogador of Lista
    if (message.body == `@${config.bot_number} rmLastJogador`) {
        removeLastJogador()
        message.reply(getLista())
        console.log('\n', getDate(), '  Removeu ultimo jogador adicionado a pedido de usuario ', message._data.notifyName.toUpperCase())
        return
    }

    // Remove last NaoVai of Lista
    if (message.body == `@${config.bot_number} rmLastNaoVai`) {
        removeLastNaoVai()
        message.reply(getLista())
        console.log('\n', getDate(), '  Removeu ultimo naovai adicionado a pedido de usuario ', message._data.notifyName.toUpperCase())
        return
    }
    
    // Add NaoVai to Lista
    if (message.body.includes(`@${config.bot_number} não `)) {
        
        let nome_naovai = message.body.replace(`@${config.bot_number} não `, '').trim()
        if (nome_naovai == '') return

        adicionarNaoVai(nome_naovai)

        message.reply(getLista())
        console.log('\n', getDate(), `  Adicionou jogador ${nome_naovai.toUpperCase()} que nao vai a lista a pedido de usuario `, message._data.notifyName.toUpperCase())
        return
    }

    // Add Jogador to Lista
    if (message.body.includes(`@${config.bot_number} add `)) {
        
        let nome_jogador = message.body.replace(`@${config.bot_number} add `, '').trim()
        if (nome_jogador == '') return

        adicionarJogadorLista(nome_jogador)
        
        message.reply(getLista())
        console.log('\n', getDate(), `  Adicionou jogador ${nome_jogador.toUpperCase()} a lista a pedido de usuario `, message._data.notifyName.toUpperCase())
        return
    } 

})

// Main Function
client.initialize()