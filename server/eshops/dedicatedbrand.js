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
        .find('.productList-title')
        .attr('href');
      const price = parseInt(
        $(element)
          .find('.productList-price')
          .text()
      );

      return {brand, name, image, price};
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
