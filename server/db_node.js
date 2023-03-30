const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://mathildesalaun:atlas2972@cluster0.jea3vhl.mongodb.net?retryWrites=true&writeConcern=majority';
const MONGODB_DB_NAME = 'clearfashion';
const products=require('C:/Users/meama/Documents/A4/S2/EWA Web Application Architectures/clear-fashion/server/all_products.json');

async function createDataBase()
{
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME);

    const collection = db.collection('products');
    await collection.deleteMany({});
    const result = await collection.insertMany(products);
    console.log("products inserted !")
    console.log(result);
    
    client.close();
}
createDataBase();

async function FilterByBrand(brand="dedicated"){
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME);
    const collection = db.collection('products');

    brand=brand.toLowerCase();
    const products_filtered=await collection.find({"brand":brand}).toArray();
    console.log(products_filtered);

    client.close();
}
//FilterByBrand();

async function LessThanPrice(price=20){
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME);
    const collection = db.collection('products');

    const products_filtered=await collection.find({"price":{$lt:price}}).toArray();
    console.log(products_filtered);

    client.close();
}
//LessThanPrice();

async function SortByPrice(order=-1){
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME);
    const collection = db.collection('products');

    const products_sorted=await collection.aggregate([{$sort:{"price":order}}]).toArray();
    console.log(products_sorted);

    client.close();
}
//SortByPrice();

async function SortByDate(order=1){
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME);
    const collection = db.collection('products');

    const products_sorted=await collection.aggregate([{$sort:{"date_scrapped":order}}]).toArray();
    console.log(products_sorted);

    client.close();
}
//SortByDate();

async function DateLessThan(nb_days=14){
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME);
    const collection = db.collection('products');

    const daysAgo=new Date(Date.now()-nb_days*24*3600*1000).toISOString();
    console.log(daysAgo);
    const products_filtered=await collection.find({"date_scrapped":{$gt:daysAgo}}).toArray();
    console.log(products_filtered);

    client.close();
}
DateLessThan();

