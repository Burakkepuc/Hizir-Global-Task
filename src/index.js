const express = require('express');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/error');

const rabbitMQ = require('./config/rabbitmq')
const port = 3000

const app = express()

//Testler sırasında devre dışı bırakabilirsiniz
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} `);
  next()
})

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use("/", require('./routes/index'))

// Global Not Found Handler
app.use(notFound)

//Error handler
app.use(errorHandler)

//Consume queue
rabbitMQ.consumeFromQueue('product_queue');
rabbitMQ.consumeFromVariantQueue('variant_queue');

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app;
