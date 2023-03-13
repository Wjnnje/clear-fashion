const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs=require("fs");

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.productList-container .productList')
    .map((i, element) => {
      const brand="dedicated";
      const name = $(element)
        .find('.productList-title')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const image = $(element)
        .find('.productList-image')
        .find('img')
        .eq(0)
        .attr('data-src');
      const price = parseInt(
        $(element)
          .find('.productList-price')
          .text());
      const color=name.substring(name.lastIndexOf(" ")+1, name.length);
      var date_scrap=new Date();//.toISOString().slice(0,10);
      return {brand, name, price, color, image, date_scrap};
    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrapeAndSave = async (url, filename) => {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const body = await response.text();
      const products=parse(body);
      fs.writeFileSync(filename, JSON.stringify(products, null, 2));

      return products;
    }

    console.error(response);

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
