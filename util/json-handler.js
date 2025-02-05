// Module imports
const fs = require('fs')
const path = require('path')

// Generic function to read json data files
    
    function readJsonFile(fileName) {

        const dataPath = path.join(__dirname, `../data/${fileName}`)

        if (!fs.existsSync(dataPath)) {
            console.error(`Arquivo ${fileName} não encontrado em:`, dataPath)
            process.exit(1)
        }

        const data = fs.readFileSync(dataPath, 'utf8')
        return JSON.parse(data)
    }

// 

// Read the config and lista files
    
    function readConfig() {
        return readJsonFile('config.json')
    }

    function readLista() {
        return readJsonFile('lista.json')
    }
// 

// Generic function to update JSON files with new data

    function updateJsonFile(fileName, updatedDataJson) {

        const dataPath = path.join(__dirname, `../data/${fileName}`)

        const updatedData = JSON.stringify(updatedDataJson, null, 3)

        fs.writeFileSync(dataPath, updatedData, 'utf8')

        return true
    }

// 

// Update the config and lista files
    
    function updateConfig(updatedConfigJson) {
        return updateJsonFile('config.json', updatedConfigJson)
    }
    
    function updateLista(updatedListaJson) {
        return updateJsonFile('lista.json', updatedListaJson)
    }

// 

// Module exports
module.exports = { readConfig, updateConfig, readLista, updateLista }