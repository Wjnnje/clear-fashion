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
const selectResaonablePrice=document.querySelector('#reasPrice')
const selectRecent=document.querySelector('#recentRelease')
const selectSort=document.querySelector('#sort-select')

const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const spanNewProducts = document.querySelector('#nbNew');
const spanNbBrands = document.querySelector('#nbBrands');

const spanp50 = document.querySelector('#p50');
const spanp90 = document.querySelector('#p90');
const spanp95 = document.querySelector('#p95');

const lastReleased = document.querySelector('#lastRelease');

const favs=document.querySelector('#favorites')


// Variables for Indicators
// Brands
let distinctBrands=[];
// New Releases
let w2_date=new Date();
w2_date.setDate(w2_date.getDate() - 14);
let recentProducts=[];
// Reasonable Price
/*let reasonablePrice={};
distinctBrands.forEach(element => {
  reasonablePrice[element]=true;
});*/
let productLast;
let allData;
let allProducts=[];




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
 * @param  {Number}  [limit=12] - limit=size
 * 
 * @param  {Number}  [price=null]
 * @param  {Object}  [brand=null]
 * @param  {Object}  [name=null]
 * @param  {Object}  [color=null]
 * @param  {Object}  [sortedBy='price-asc']
 * @param  {Boolean} [favorite=false]
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12, price=null, brand=null, name=null, color=null, favorite=false, sortedBy='price-asc', reasonablePrice=false) => {
  try {
    /*const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );*/
    const response = await fetch(
      `https://clear-fashion-ew7a.vercel.app/products/search?limit=${size}`
      + (price !== null ? `&price=${price}` : "")
      + (brand !== null ? `&brand=${brand}` : "")
      + (name !== null ? `&name=${name}` : "")
      + (color !== null ? `&color=${color}` : "")
      + (favorite !== false ? `&favorite=true` : "")
    );

    let body = await response.json();
    
    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    let result=body.data.result;
    let meta={
      currentPage:page,
      pageCount: Math.ceil(result.length/limit),
      pageSize: limit,
      count: result.length
    };

    //FILTER
    if(reasonablePrice){
      body.result=body.result.filter(myProducts =>{return myProducts.favorite=true;});
      if (body.result.length==0) return false;
    }

    //SORT
    switch (sort){
      case 'price-asc':
        result=result.sort((a,b)=>a.price-b.price);
        break;
      case 'price-desc':
        result=result.sort((a,b)=>b.price-a.price);
        break;
      case 'date-asc':
        result=result.sort((a,b)=>new Date(a.date_scrap)-new Date(b.date_scrap));
        break;
      case 'date-desc':
        result=result.sort((a,b)=>new Date(a.date_scrap)-new Date(b.date_scrap));
        break;
    }

    //INDICATORS
    const nbProducts=body.result.length;
    let indexLast=0;
    for (let i=0;i<result.length;i++){
      if (!Object.keys(distinctBrands).includes(result[i].brand)) distinctBrands.push(result[i].brand);
      if (new Date(result[i].released)>w2_date) recentProducts.push(result[i]);
      if (result[i].price>100) reasonablePrice[result[i].brand]=false;
      if (new Date(result[i].released)>new Date(result[indexLast])) indexLast=i;
    }
    const nbBrands=distinctBrands.length;
    const nbNew=recentProducts.length;
    spanNbBrands.innerHTML = nbBrands;
    spanNewProducts.innerHTML = nbNew;
    lastReleased.innerHTML=result[indexLast].released;
  
    //p-values
    let brands_price=Object.create(result);
    brands_price.sort((a,b)=>{return a.price-b.price;});
    console.log(brands_price);
  
    let placep50=Math.ceil(0.5*brands_price.length)-1;
    console.log(placep50);
    let p50=brands_price[placep50];
    spanp50.innerHTML = p50.price;

  
    let placep90=Math.ceil(0.9*brands_price.length)-1;
    let p90=brands_price[placep90];
    spanp90.innerHTML = p90.price;

    let placep95=Math.ceil(0.95*brands_price.length)-1;
    let p95=brands_price[placep95];
    spanp95.innerHTML = p95.price;
    console.log(allProducts);


    return {result, meta};

  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};


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
      <div class="product" id=${product._id}>
        <span>${product.brand}</span>
        <a href="${product.link}" target="Blank">${product.name}</a>
        <span>${product.price}</span>
        <span>${product.color}</span>
        <span> Favorit : ${product.favorite}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};


/*function renderInfos (allProducts) {
//GET BRANDS (Feature2) / RECENT (Feature)
  var indexLast=0;
  for (let i=0;i<allProducts.length;i++){
    if (!Object.keys(distinctBrands).includes(allProducts[i].brand)) distinctBrands.push(allProducts[i].brand);
    if (new Date(allProducts[i].released)>w2_date) recentProducts.push(allProducts[i]);
    if (allProducts[i].price>100) reasonablePrice[allProducts[i].brand]=false;
    if (new Date(allProducts[i].released)>new Date(allProducts[indexLast])) indexLast=i;
  }
  const nbBrands=distinctBrands.length;
  const nbNew=recentProducts.length;
  spanNbBrands.innerHTML = nbBrands;
  spanNewProducts.innerHTML = nbNew;
  lastReleased.innerHTML=allProducts[indexLast].released;
  
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
};*/
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
let price=100;
let brand=null;
let name_=null;
let color=null;
let favorite=false;
let sortedBy='price-asc';
let reasonablePrice=false;

selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value), price, brand, name_, color, favorite, sortedBy, reasonablePrice);
  show=parseInt(event.target.value);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectPage.addEventListener('change', async(event)=>{
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value), price, brand, name_, color, favorite, sortedBy, reasonablePrice);
  page=parseInt(event.target.value);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectResaonablePrice.addEventListener('click', async(event)=>{
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value), price, brand, name_, color, favorite, sortedBy, reasonablePrice);
  if(products){
    setCurrentProducts(products);
    render(currentProducts,currentPagination);
  }
});

selectRecent.addEventListener('click', async(event)=>{
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value), price, brand, name_, color, favorite, sortedBy, reasonablePrice);
  if(products){
    setCurrentProducts(products);
    render(currentProducts,currentPagination);
  }
});

selectSort.addEventListener('change', async(event)=>{
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value), price, brand, name_, color, favorite, sortedBy, reasonablePrice);
  if(products){
    setCurrentProducts(products);
    render(currentProducts,currentPagination);
  }
})

document.addEventListener('DOMContentLoaded', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value), price, brand, name_, color, favorite, sortedBy, reasonablePrice);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});





