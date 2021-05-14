const express = require('express')
const cors = require('cors')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const bodyParser = require('body-parser')
const shortid = require('shortid')
const _ = require('lodash')

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ scores: [] }).write()

app.post('/scores', function (req, res) {
  const { data } = req.body

  db.get('scores')
    .push({
      ...data,
      id: shortid.generate(),
      createdAt: new Date()
    })
    .write()

  res.send({
    success: true
  })
})

app.get('/scores', (req, res) => {
  const scores = db.get('scores').value()

  res.send({
    scores: _.sortBy(scores, 'score')
  })
})

app.listen(3001)
