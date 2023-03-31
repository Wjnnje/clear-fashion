const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const {ObjectID}=require('bson');
let ObjectId=require('mongodb').ObjectId;

const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://mathildesalaun:atlas2972@cluster0.jea3vhl.mongodb.net?retryWrites=true&writeConcern=majority';
const MONGODB_DB_NAME = 'clearfashion';
//const products=require('C:/Users/meama/Documents/A4/S2/EWA Web Application Architectures/clear-fashion/server/all_products.json');


const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', async (request, response) => {
  response.send({'ack': true});
});

app.get('/product/:id', async (request, response) => {
  
  try{
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db =  client.db(MONGODB_DB_NAME);
  const collection = db.collection('products');

  var id_product=request.params.id;
  var product=await collection.findOne({_id:new ObjectId(id_product)})
  response.send({result:product});
  } catch(e){response.send({error : "invalid id !"});}
  //client.close();
});

app.get('/products/search', async (request, response) => {

  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db =  client.db(MONGODB_DB_NAME);
  const collection = db.collection('products');
  
  try{
  let lim = parseInt(request.query.limit) || 12;
  let brand = request.query.brand || undefined;
  let color = request.query.color|| undefined;
  let maxPrice = parseFloat(request.query.price) || undefined;
  let partOfName = request.query.name || undefined;
  //let recent = request.query.recent || undefined;

  //let sortedByPrice = request.query.sortedByPrice || false;
  //let sortedByDate = request.query.sortedByDate || false;

  //var result_query=[];
  var query={};
  if (brand!==undefined) query.brand=brand.toUpperCase();
  if (color!==undefined) query.color=color.toUpperCase();
  if (maxPrice!==undefined) query.price={$lte:maxPrice};
  if (partOfName!==undefined) query.name={$regex:partOfName.toUpperCase()};
  //if (partOfName!==undefined) query.name={ $or: [ {name:{$regex:partOfName}}, {name:{$regex:partOfName.toUpperCase()}}, {name:{$regex:partOfName.toLowerCase()}} ] };
  //if (recent!==undefined) query.date_scrap={$gte:{$dateSubtract:{startDate:ISODate(), unit:"week", amount:recent}}};

  let result_query=await collection
  .find(query)
  .limit(lim)
  .sort({price:1})
  .toArray();

  //if(sortedByPrice) result_query.sort({price:-1});
  //if(sortedByDate) result_query.sort({date_scrapped:1});

  response.send({result:result_query});
  //client.close();

  } catch(e){response.send({error : "query not valid !"});  }
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);



