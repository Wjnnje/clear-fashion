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

  return $('.grid__item')
    .map((i, element) => {
      const brand="circle_sportswear";
      const name = $(element)
        .find('.full-unstyled-link')
        .text()
        .trim()
        .replace(/\s/g, ' ');
        
      const price = parseInt(
        $(element)
          .find('.money')
          .text()
          .replace("€","")
      );
      const characteristics = $(element)
        .find('.card__characteristic')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      const image=$(element)
        .find('.motion-reduce')
        .attr('srcset');
      var date_scrap=new Date().toISOString().slice(0,10);
      return {brand, name, price, image,characteristics, date_scrap};
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
