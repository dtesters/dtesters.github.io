const puppeteer = require('puppeteer');
const url = '[4](https://www.amazon.in/s?k=Shirts&ref=nb_sb_noss_2)';

async function fetchProductList(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  // get the product elements
  const products = await page.$$('.s-result-item');

  // loop through each product and get the title, price and image
  const productList = [];
  for (let product of products) {
    const title = await product.$eval('.a-size-medium', (text) => text.innerText);
    const price = await product.$eval('.a-price-whole', (text) => text.innerText);
    const image = await product.$eval('.s-image', (img) => img.src);

    // push the product data to the list
    productList.push({ title, price, image });
  }

  // close the browser
  await browser.close();

  // return the product list as JSON
  return JSON.stringify(productList, null, 2);
}

fetchProductList(url).then(console.log);
