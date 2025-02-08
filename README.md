# Futebot

Futebot is a simple bot that helps to manage soccer matches between friends!

- **DISCLAIMER** - for now, the app was made for personal use only, so if _you_ want to use for your soccer matches, you should edit some infos in the code, for example, the list template, the bot telephone number, the dates and hours of the periodic functions and other things. But this will be updated in the future. Thanks for the comprehension. _Enjoy!!!_


## What can it do ?

- Lists players that confirmed presence in the next match and players that confirmed their absence
- Time by time resends the List so players don't forget to confirm if they will go or not
- Draws the teams right before the match time

## Setup

- Clone the repo to your machine
- In the cloned dir terminal, type  `npm i`  so that the needed packs are installed
- Start the app with  `npm start`
- On your first time using, you will be required to scan a QR code to connect the bot to the telephone number you will use for it
- After authenticating, put the bot in your soccer group chat
- That's it !! Should work fine.

## Commands

To use the commands, the user must ping the bot and use the correct word in the group chat

- add [player] - confirms player presence in the next match
- não [player] - confirms player absence in the next match
- showLista - sends the list in the chat
- rmJogador [player] - removes the specified player of the list of confirmed players
- rmNaoVai [player] - removes the specified player of the list of absent players
- rmLastJogador [player] - removes last player added to the confirmed list
- rmLastNaoVai [player] - removes last player added to the absent list
- resetLista - resets the weekly list (bot admin only)

## Technologies used

JavaScript, NodeJS, whatsapp-web.js, other NodeJS modules, JSON for data

## FAQs

- Q: I am not able to read the QR code in the authentication step...
- A: edit the bot.js file, change the qr code part to: 
    ```
        client.on("qr", (qr) => {
            console.log("Escaneie o QR Code abaixo:")
            qrcode.generate(qr, { small: true })
        })
    ```