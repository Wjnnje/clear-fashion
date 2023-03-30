const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs=require('fs');
/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.products-list__block')
    .map((i, element) => {
      const brand = "MONTLIMART";
      const name = $(element)
        .find('.text-reset')
        .text()
        .trim()
        .replace(/\s/g, ' ')
        .toUpperCase();
      const link=$(element)
      .find('.product-miniature_thumb-link')
      .attr('href');

      const price = parseInt(
        $(element)
          .find('.price')
          .text()
      );
      const color = $(element)
        .find('.product-miniature__color')
        .text()
        .trim()
        .replace(/\s/g, ' ')
        .toUpperCase();
      const image=$(element)
        .find('.w-100')
        .attr('data-src');
      var date_scrap=new Date();//.toISOString().slice(0,10);
      return {brand, name, link, price, color, image, date_scrap};
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
