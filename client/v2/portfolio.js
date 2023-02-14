// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api
GET https://clear-fashion-api.vercel.app/

Search for specific products

This endpoint accepts the following optional query string parameters:

- `page` - page of products to return
- `size` - number of products to return

GET https://clear-fashion-api.vercel.app/brands

Search for available brands list
*/

// current products on the page
let currentProducts = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const spanNewProducts = document.querySelector('#nbNew');
const spanNbBrands = document.querySelector('#nbBrands');
const spanp50 = document.querySelector('#p50');
const spanp90 = document.querySelector('#p90');
const spanp95 = document.querySelector('#p95');
const lastReleased = document.querySelector('#lastRelease');



// Variables for Indicators
// Brands
var distinctBrands=[];
// New Releases
var w2_date=new Date();
w2_date.setDate(w2_date.getDate() - 14);
var recentProducts=[];
// Reasonable Price
var reasonablePrice={};
distinctBrands.forEach(element => {
  reasonablePrice[element]=true;
});
var allData;
var allProducts=[];



/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Fetch products from api
 * @return {Object}
 */
const fetchAll = async (page = 1, size = 12) => {
  var finished=false;
  var previous={};
  while(!finished)
  {
    try {
      const response = await fetch(
        `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
      );
      const body = await response.json();
  
      if (body.success !== true) {
        console.error(body);
        return {currentProducts, currentPagination};
      }
      allProducts.push(body.data);
      if (body.data==previous) finished=true;
      previous=body.data;
    
    } catch (error) {
      console.error(error);
      return {currentProducts, currentPagination};
    }
  }
  console.log(allProducts)
  return allProducts
};
/*
function renderAllProducts() {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  
  const template = allProducts
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}" target="Blank">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);

};*/

/**
 * Render list of products
 * @param  {Array} products
 */
const testProducts = test => {console.log(products);};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}" target="Blank">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
  renderInfos(products);
};


function renderInfos (allProducts) {
//GET BRANDS (Feature2) / RECENT (Feature)
  for (let i=0;i<allProducts.length;i++){
    if (!Object.keys(distinctBrands).includes(allProducts[i].brand)) distinctBrands.push(allProducts[i].brand);
    if (new Date(allProducts[i].released)>w2_date) recentProducts.push(allProducts[i]);
    if (allProducts[i].price>100) reasonablePrice[allProducts[i].brand]=false;
  }
  const nbBrands=distinctBrands.length;
  const nbNew=recentProducts.length;
  spanNbBrands.innerHTML = nbBrands;
  spanNewProducts.innerHTML = nbNew;
  
  //GET PVALUES (Feature 10)
  var brands_price=Object.create(allProducts);
  brands_price.sort((a,b)=>{
    if(a.price>b.price) return 1;
    if(a.price<b.price) return -1;
      return 0;
  });
  console.log(brands_price);
  //console.log(allProducts);
  
  var placep50=Math.round(0.5*brands_price.length)-1;
  console.log(placep50);
  var p50=brands_price[placep50];
  spanp50.innerHTML = p50.price;

  
  var placep90=Math.round(0.9*brands_price.length)-1;
  var p90=brands_price[placep90];
  spanp90.innerHTML = p90.price;

  var placep95=Math.round(0.95*brands_price.length)-1;
  var p95=brands_price[placep95];
  spanp95.innerHTML = p95.price;
  console.log(allProducts);
};

//renderInfos(products);

/**
 * Render page selector
 * @param  {Object} pagination
 * @param  {Array}  distinctBrands
 */
const filterPage = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Array} products
 */
const renderFilter = pagination => {
  /*const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;*/
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
  
  //spanNbBrands.innerHTML=nbBrands;
};



const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

/*selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});*/



