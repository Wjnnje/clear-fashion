const {connect}=require('http2');
const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://mathildesalaun:atlas2972@cluster0.jea3vhl.mongodb.net?retryWrites=true&writeConcern=majority';
const MONGODB_DB_NAME = 'clearfashion';
const products=require('C:/Users/meama/Documents/A4/S2/EWA Web Application Architectures/clear-fashion/server/all_products.json');
const {ObjectID}=require('bson');
var ObjectId=require('mongodb').ObjectId;

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
//FetchProducts();

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
//FetchProductID();

module.exports={
    FetchProducts,
    FetchProductID
}



