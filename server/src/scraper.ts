// import scrapy from 'node-scrapy';
// import axios from 'axios';
import puppeteer, { Browser, Page } from 'puppeteer';
import { SrealityFlatsModel } from './scrapeModels';
import { delay } from './utils';

const scrapy = require('node-scrapy');

export default class Scraper {
  URL: string;
  page?: Page;
  scrapedItemsNum: number;
  browser?: Browser;
  scrapedData: any[];
  storeBatchCB: Function;
  scapingState: boolean;

  constructor(batchCB: Function) {
    this.URL = 'https://www.sreality.cz/hledani/prodej/byty';
    this.page = undefined;
    this.scrapedItemsNum = 0;
    this.browser = undefined;
    this.scrapedData = [];
    this.storeBatchCB = batchCB;
    this.scapingState = false;
  }

  async start() {
    this.scapingState = true;
    for (let i=0; i<30; i++) {
      const page = i + 1;
      const ads: any = await this.scrapeSrealityAds(page);
      // console.log(ads, 'ads');
      // if (ads.rows == null) { break; }
      if (ads.rows) {
        const batch = [];
        for(const a of ads.rows) {
          const id = a.flat.href.trim().split('/');
          batch.push({
            id: id[id.length-1],
            name: a.flat.name.trim(),
            location: a.flat.location.trim(),
            price: a.flat.price.trim()
          });
          console.log('ad: ', id[id.length-1], a.flat.name.trim(), a.flat.location.trim(), a.flat.price.trim());
        }
        this.storeBatchCB(batch);
        this.scrapedData = this.scrapedData.concat(batch);
      }
    }
    this.scapingState = false;
    console.log(this.scrapedData);
  }

  async startBrowser() {
    this.browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    this.browser.on('closed', () => {
      this.closeBrowser();
    })
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
    }
    this.browser = undefined;
    this.page = undefined;
  }

  async openPage(url: string) {
    if (!this.browser) {
      await this.startBrowser();
    }
    if (this.browser && !this.page){
      this.page = await this.browser.newPage();
      
      this.page.on('error', (error) => {
        console.log(error, 'PAGE ERROR');
      });
      
      await this.page.setRequestInterception(true);
      
      this.page.on('request', (req) => req.continue());
      
      this.page.on('response', (res) => {
        if (res.url() === url && res.status() === 429) {
          console.log(res, 'RES 429');
        }
      });
    }
    if (this.page) {
      await this.page.goto(url, {
        // waitUntil: ['domcontentloaded', 'networkidle2'],
        waitUntil: ['networkidle2'],
      }).catch(e => console.log(e, 'prdoprd'));
    }
  }

  async scrapeSrealityAds(page: number) {
    return new Promise(async (resolve, reject) => {
      const url = page > 0 ? `${this.URL}?strana=${page}` : this.URL;
      console.log(url);
      await this.openPage(url);
      if (this.page) {
        await delay(2000);
        var HTML = await this.page.mainFrame().content();
        const parsedJSON = scrapy.extract(HTML, SrealityFlatsModel);
        resolve(parsedJSON);
        // resolve(JSON.stringify(parsedJSON));
      }
      reject(null);
    });
  }
}
