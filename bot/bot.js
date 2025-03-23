// Module Imports
    const { Client, LocalAuth } = require("whatsapp-web.js")
    const qrcode = require("qrcode-terminal")
    const prettyjson = require('prettyjson')
// 

// Functions Imports
    const { getDate } = require("../util/get-date.js")
    const { readConfig, updateConfig, updateLista } = require('../util/json-handler.js')
    const { addToLista, removeFromLista, getLista, sorteiaTimes } = require("../services/lista-service.js")

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

    let config = readConfig()
    delete config.message_template
    console.log('\n', getDate())
    console.log(prettyjson.render(config, {
        noAlign: true,
        noColor: true,
        maxStringLength: 20
    }))

    console.log('\n', getDate(), '  Iniciando chamada de funcoes agendadas')

    // Daily/Hourly Get Lista Function
    console.log('\n', getDate(), '  Chamando scheduleEnviaLista...')
    scheduleEnviaLista(client)
    console.log('', getDate(), '  scheduleEnviaLista chamado com sucesso!')

    // Weekly Clear Lista Function
    console.log('\n', getDate(), '  Chamando scheduleLimpaLista...')
    scheduleLimpaLista(client)
    console.log('', getDate(), '  scheduleLimpaLista chamado com sucesso!')

    // Weekly Draw Times from Lista
    console.log('\n', getDate(), '  Chamando scheduleSorteiaTimes...')
    scheduleSorteiaTimes(client)
    console.log('', getDate(), '  scheduleSorteiaTimes chamado com sucesso!')

})

// Message Listener
client.on("message", async (message) => {
    
    let config = readConfig()
    
    if (message.mentionedIds.includes(`${config.bot_number}@c.us`)) {
        
        const chat = await message.getChat()
        let group_name = chat.name
        
        // console.log(chat)
        // console.log(message)

        console.log('\n\n-----\n\n\n', getDate(), '  Mensagem recebida:')
        console.log('    ',message.body)
        console.log('   Autor:',message._data.notifyName)
        console.log('   Numero:', message.author)
        console.log('   Grupo:', group_name)
    }

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
        message.reply("*COMANDOS* \n\nadd - adiciona o nome na lista\nnão - adiciona o nome que não vai\n\nshowLista - Mostra a lista da semana\n\nremoveJogador - remove o jogador\nremoveNaoVai - remove o que não vai\nremoveLastJogador - remove o último nome da lista\nremoveLastNaoVai - remove o último nome da lista de quem não vai\n\nresetLista - reseta a lista da semana (admin only)\ndrawTimes - refaz o sorteio (admin only)\n")
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
            "jogador": [],
            "numero_jogador": 0,
            "goleiro": [],
            "numero_goleiro": 0,
            "duvida": [],
            "numero_duvida": 0,
            "ausente": [],
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

    // Lista manager function
    if (message.body.includes(`@${config.bot_number} add`) ||
        message.body.includes(`@${config.bot_number} remove`)) {
        
        let match = message.body.replace(`@${config.bot_number} `, '')
                    .trim()
                    .match(/^(\S+)\s+(\S+)\s+(.+)$/)
        ;
        let message_array = match ? [match[1], match[2], match[3]] : message.body.split(/\s+/)
        
        let message_command = message_array[0]
        let message_type = message_array[1]
        let message_name = message_array[2]

        if (!['add', 'remove'].includes(message_command)) return
        if (!['jogador', 'goleiro', 'duvida', 'ausente'].includes(message_type)) return
        if (!message_name) return

        if (message_command == 'add') {
            addToLista(message_name, message_type, 'numero_'+message_type)
            message.reply(getLista())
            console.log('\n', getDate(), `  Adicionou jogador ${message_name.toUpperCase()} a lista a pedido de usuario `, message._data.notifyName.toUpperCase())
            return
        }

        if (message_command == 'remove') {
            let achou_removeu = removeFromLista(message_name, message_type, 'numero_'+message_type)
            if(achou_removeu) {
                message.reply(getLista())
                console.log('\n', getDate(), `  Removeu ${message_type} ${message_name.toUpperCase()} a pedido de ${message._data.notifyName.toUpperCase()}`)
            } 
            else {
                message.reply(`${message_type} ${message_name} não esta na lista 🧐!!`)
                console.log('\n', getDate(), `  Não removeu ${message_type.toUpperCase()} ${message_name.toUpperCase()} a pedido de ${message._data.notifyName.toUpperCase()}: NAO ESTA NA LISTA`)
            }
            return
        }

    } 


        return
    }
})

// Main Function
client.initialize()