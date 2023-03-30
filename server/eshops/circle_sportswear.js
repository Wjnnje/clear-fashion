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
      const brand="CIRCLE_SPORTSWEAR";
      var name = $(element)
        .find('.full-unstyled-link')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      name=name.substring(0, Math.floor(name.length/2)).toUpperCase();
      const link="https://shop.circlesportswear.com"+$(element).find('.full-unstyled-link').attr('href');  
      const price = parseInt(
        $(element)
          .find('.money')
          .text()
          .replace("€","")
      );
      var characteristics = $(element)
        .find('.card__characteristic')
        .text()
        .trim()
        .replace(/\s/g, ' ');
      characteristics=characteristics.substring(0, Math.floor(characteristics.length/2)).toUpperCase();
      const image=$(element)
        .find('.media')
        .find('img')
        .eq(0)
        .attr('src');
      var color=$(element)
      .find('.color-variant')
      .eq(0)
      .attr('data-color');
      
      var date_scrap=new Date();//.toISOString().slice(0,10);
      return {brand, name, link, price, color, characteristics, image, date_scrap};
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
