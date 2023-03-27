const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const {MongoClient} = require('mongodb');
const {ObjectID}=require('bson');
var ObjectId=require('mongodb').ObjectId;

const MONGODB_URI = 'mongodb+srv://mathildesalaun:atlas2972@cluster0.jea3vhl.mongodb.net?retryWrites=true&writeConcern=majority';
const MONGODB_DB_NAME = 'clearfashion';
//const products=require('C:/Users/meama/Documents/A4/S2/EWA Web Application Architectures/clear-fashion/server/all_products.json');


/*//==========================Functions======================
async function FetchProducts(limit=12, brand=undefined, maxPrice=undefined, partOfName=undefined, sortedByPrice=false, sortedByDate=false, recent2weeks=false){
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db =  client.db(MONGODB_DB_NAME);
  const collection = db.collection('products');

  var result=[];
  var query={};
  try{
      if (brand!=undefined){
          brand=brand.toLowerCase();
          query.brand=brand;
      }
      if (maxPrice!=undefined) query.price={$lt:maxPrice};
      if (partOfName!=undefined) query.name={$regex:partOfName};
      if (recent2weeks) query.date_scrapped={$lte:new Date(Date.now()-1000*60*60*24*1000)};

      result=await collection.find(query)

      if (sortedByPrice) result=result.sort({price:1});
      if (sortedByDate) result=result.sort({date_scrapped:-1});

      result=await result.toArray;

      if(result.length()>=limit) result=result.slice(limit);
      client.close();
      console.log(result);
      return result;
  } catch(e){response.send({error : "query not valid !"});  }
}

async function FetchProductID(ID='640e69d4c433c3aa7ebbc895'){
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db =  client.db(MONGODB_DB_NAME);
  const collection = db.collection('products');
  try{
      const result=await collection.find({_id:new ObjectId(ID.params.id)}).toArray();
      console.log(result);
      client.close();
      return(result);
  } catch(e){response.send({error : "id not valid !"});  }
}

//=========================================================
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

app.get('/products/*', async (request, response) => {
  var id=request.params[0];
  var product=await FetchProductID(id);
  response.send(product);
});

app.get('/products/search', async (request, response) => {
  console.log("Requete : /products/search, params : ", request.query);
  
  let limit = parseInt(request.query.limit) || 12;
  let brand = request.query.brandName || undefined;
  let maxPrice = parseFloat(request.query.price) || undefined;
  let partOfName = request.query.partOfName || undefined;
  let sortedByPrice = request.query.sortedByPrice || false;
  let sortedByDate = request.query.sortedByDate || false;
  let recent2weeks = request.query.recent2weeks || false;
  var products = await FetchProducts(limit, brand, maxPrice, partOfName, sortedByPrice, sortedByDate, recent2weeks);
  response.send(products);
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);*/

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

app.get('/products/*', async (request, response) => {
  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db =  client.db(MONGODB_DB_NAME);
  const collection = db.collection('products');
  try{
  var id=request.params[0];
  var product=await collection.find({_id:new ObjectId(id)})
  response.send(product);
  client.close();} catch(e){response.send({error : "invalid id !"});}
});

/*app.get('/products/search', async (request, response) => {

  const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
  const db =  client.db(MONGODB_DB_NAME);
  const collection = db.collection('products');
  
  try{
  let lim = parseInt(request.query.limit) || 12;
  let brand_ = request.query.brand || undefined;
  let maxPrice = parseFloat(request.query.price) || undefined;
  let partOfName = request.query.partOfName || undefined;
  //let sortedByPrice = request.query.sortedByPrice || false;
  //let sortedByDate = request.query.sortedByDate || false;
  //let recent2weeks = request.query.recent2weeks || false;
  //var products = await FetchProducts(limit, brand, maxPrice, partOfName, sortedByPrice, sortedByDate, recent2weeks);
  //response.send(products);

  //var result_query=[];
  var query={};
  if (brand!==undefined){
            brand=brand.toLowerCase();
            query.brand=brand_;
  }
  if (maxPrice!==undefined) query.price={$lt:maxPrice};
  //if (partOfName!==undefined) query.name={$regex:partOfName};
  //if (recent2weeks!=false) query.date_scrapped={$lte:new Date(Date.now()-1000*60*60*24*1000)};

  let result_query=await collection
  .find(query)
  .limit(lim)
  .sort({price:1})
  .toArray();
  response.send({result:result_query});
  //client.close();

  } catch(e){response.send({error : "query not valid !"});  }
});*/

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);



