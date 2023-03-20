const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);

const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://mathildesalaun:atlas2972@cluster0.jea3vhl.mongodb.net?retryWrites=true&writeConcern=majority';
const MONGODB_DB_NAME = 'clearfashion';
const products=require('C:/Users/meama/Documents/A4/S2/EWA Web Application Architectures/clear-fashion/server/all_products.json');

app.get('/products', (request, response) => {
  response.send({'ack': true});
});