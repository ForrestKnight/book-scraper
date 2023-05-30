import puppeteer from "puppeteer-core";

async function run() {
    let browser;
    try {

        const auth = 'USERNAME:PASSWORD';
      
        browser = await puppeteer.connect({
            browserWSEndpoint: `wss://${auth}@zproxy.lum-superproxy.io:9222`,
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(2 * 60 * 1000);

        await page.goto('https://books.toscrape.com/');

        const books = await page.evaluate(() => {
            const titleNodes = document.querySelectorAll('.product_pod h3 a');
            const priceNodes = document.querySelectorAll('.product_pod .price_color');

            const titles = Array.from(titleNodes, node => node.innerText);
            const prices = Array.from(priceNodes, node => node.innerText);

            return titles.map((title, i) => ({
                title,
                price: prices[i],
            }));
        });

        console.log(books);
    } catch(e) {
        console.error('scrape failed', e);
    } finally {
        await browser?.close();
    }
}

run();