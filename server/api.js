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

const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://mathildesalaun:atlas2972@cluster0.jea3vhl.mongodb.net?retryWrites=true&writeConcern=majority';
const MONGODB_DB_NAME = 'clearfashion';
const products=require('C:/Users/meama/Documents/A4/S2/EWA Web Application Architectures/clear-fashion/server/all_products.json');

app.get('/products', (request, response) => {
  response.send({'ack': true});
});

app.get('/products/search', async (request, response) => {
  response.send({'ack': true});
  let limit = request.query.limit || 12;
  let brand = request.query.brandName || undefined;
  let maxPrice = request.query.price || undefined;
  let partOfName = request.query.partOfName || undefined;
  let sortedByPrice = request.query.sortedByPrice || false;
  let sortedByDate = request.query.sortedByDate || false;
  let recent2weeks = request.query.recent2weeks || false;
  var products = await MongoClient.fetchProducts(limit, brand, maxPrice, partOfName, sortedByPrice, sortedByDate, recent2weeks);
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);