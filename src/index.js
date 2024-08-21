const express = require('express')
const port = 3000

const app = express()

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} `);
  next()
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})