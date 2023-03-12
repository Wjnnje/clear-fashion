const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://mathildesalaun:atlas2972@cluster0.jea3vhl.mongodb.net?retryWrites=true&writeConcern=majority';
const MONGODB_DB_NAME = 'clearfashion';


async function createDataBase()
{
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db =  client.db(MONGODB_DB_NAME)

    const products = [];

    const collection = db.collection('products');
    const result = collection.insertMany(products);

    console.log(result);
}