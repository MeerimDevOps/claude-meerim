const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.send('Student Service Running')
})

app.get('/api/students', (req, res) => {
  res.json([
    {
      id: 1,
      name: "Emma"
    },
    {
      id: 2,
      name: "John"
    }
  ])
})

app.listen(3000, '0.0.0.0', () => {
  console.log('Student service running')
})
