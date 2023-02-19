/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const montlimartbrand = require('./eshops/montlimart');
const circlebrand = require('./eshops/circle_sportswear');

const link_dedicated="https://www.dedicatedbrand.com/en/men/news";
const link_montlimart="https://www.montlimart.com/99-vetements";
const link_circle="https://shop.circlesportswear.com/collections/all";

async function sandbox (eshop1 = link_dedicated, eshop2=link_montlimart, eshop3=link_circle) {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop1} eshop`);
    const products_dedicated = await dedicatedbrand.scrape(eshop1);

    console.log(`🕵️‍♀️  browsing ${eshop2} eshop`);
    const products_montlimart = await montlimartbrand.scrape(eshop2);

    console.log(`🕵️‍♀️  browsing ${eshop3} eshop`);
    const products_circle = await circlebrand.scrape(eshop3);


    console.log('===============Dedicated=============');
    console.log(products_dedicated);
    console.log('===============Montlimart=============');
    console.log(products_montlimart);
    console.log('===============Circle Sportswear=============');
    console.log(products_circle);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop1, eshop2, eshop3] = process.argv;

sandbox(eshop1, eshop2, eshop3);
