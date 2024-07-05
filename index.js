var express = require('express')
var app = express()
app.use(express.json())

var connectionMsgQueue = {}
var connectedId = {}

app.get('/', async function(req, res) {
    return res.send('<h1>Gateway server</h1>')
})
app.post('/establishSession', async function(req, res) {
    if (req.body.localId != undefined && req.body.sendId != undefined) {
        connectionMsgQueue[req.body.sendId] = []
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