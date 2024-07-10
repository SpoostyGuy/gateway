var express = require('express')
var randomId = require('random-id')
var app = express()
app.use(express.json())

var connectionMsgQueue = {}
var connectedId = {}
var credentialsExist = []

app.post('/establishCredentials', async function(req, res) {
    var clientId = undefined
    while (true) {
        var id = randomId(24, 'aA0')
        if (credentialsExist.includes(id)) {
        } else {
            clientId = id
            break
        }
    }
    credentialsExist.push(clientId)
    var serverId = undefined
    while (true) {
        var id = randomId(24, 'aA0')
        if (credentialsExist.includes(id)) {
        } else {
            serverId = id
            break
        }
    }
    credentialsExist.push(serverId)
    return res.status(200).send({
        clientId: clientId,
        serverId: serverId
    })
})

app.post('/establishSession', async function(req, res) {
    if (req.body.localId != undefined && req.body.sendId != undefined) {
        connectionMsgQueue[req.body.sendId] = ['-- CONNECTED TO SERVER --']
        connectionMsgQueue[req.body.localId] = []
        connectedId[req.body.localId] = req.body.sendId
        return res.json({
            'established': true
        })
    } else {
        return res.json({
            'established': false
        })
    }
})

app.post('/getMsgs', async function(req, res) {
    if (req.body.localId != undefined && req.body.sendId != undefined) {
        if (connectedId[req.body.localId] == req.body.sendId) {
            res.json({
                'messages': connectionMsgQueue[req.body.localId]
            })
            connectionMsgQueue[req.body.localId].shift()
        } else {
            return res.json({
                'messages': false
            })
        }
    } else {
        return res.json({
            'messages': false
        })
    }
})

app.post('/sendMsg', async function(req, res) {
    if (req.body.localId != undefined && req.body.sendId != undefined && req.body.message != undefined) {
        if (connectedId[req.body.localId] == req.body.sendId) {
            connectionMsgQueue[req.body.sendId].push(req.body.message)
            return res.json({
                'sent': true
            })
        } else {
            return res.json({
                'sent': false
            })
        }
    } else {
        return res.json({
            'sent': false
        })
    }
})

app.listen(3000)

module.exports = app