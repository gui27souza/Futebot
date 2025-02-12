# Futebot

Futebot is a simple bot that helps to manage soccer matches between friends!

## What can it do ?

- Lists players that confirmed presence in the next match and players that confirmed their absence
- Time by time resends the List so players don't forget to confirm if they will go or not
- Draws the teams right before the match time

## Setup

- Clone the repo to your machine
- In the cloned dir terminal, type  `npm i`  so that the needed packs are installed
- Go to data/config.json
    - Insert the telephone number your bot is going to use with the country code and ddd 
    <br>Example for BR: ```5511999999999```
    - It's recommended to insert at least one telephone number to the bot admin attribute in the same format of the bot number, but adding @c.us at the end 
    <br>Example: ```5511999999999@c.us```
    - Insert the day of the week the match will happen in ```matchday```.
    <br>Example: Sunday is ```1```, Tuesday is ```3```, Friday is ```6```
    - You can also change the list template, but that's optional
- Start the app with  `npm start`
- On your first time using, you will be required to scan a QR code to connect the bot to the telephone number you will use for it
- After authenticating, put the bot in your soccer group chat
- That's it !! Should work fine.

## Commands

To use the commands, the user must ping the bot and use the correct word in the group chat

#### User Commands
- help - displays the commands
<br><br>
- add [player] - confirms player presence in the next match
- não [player] - confirms player absence in the next match
<br><br>
- showLista - sends the list in the chat
<br><br>
- removeJogador [player] - removes the specified player of the list of confirmed players
- removeNaoVai [player] - removes the specified player of the list of absent players
- removeLastJogador - removes last player added to the confirmed list
- removeLastNaoVai - removes last player added to the absent list

#### Bot Admin Commands
- resetLista - resets the weekly list
- drawTimes - draw Times of Jogadores

## Technologies used

JavaScript, NodeJS, whatsapp-web.js, JSON for data and other NodeJS modules (fs, node-schedule, path, qrcode-terminal)

## FAQs

- Q: I am not able to read the QR code in the authentication step...
- A: edit the bot.js file, change the qr code part to: 
    ```
        client.on("qr", (qr) => {
            console.log("Escaneie o QR Code abaixo:")
            qrcode.generate(qr, { small: true })
        })
    ```