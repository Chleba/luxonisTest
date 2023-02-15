// import scrapy from 'node-scrapy';
import axios from 'axios';
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

  constructor() {
    this.URL = 'https://www.sreality.cz/hledani/prodej/byty';
    this.page = undefined;
    this.scrapedItemsNum = 0;
    this.browser = undefined;
    this.scrapedData = [];
  }

  async start() {
    for (let i=0; i<30; i++) {
      const page = i + 1;
      console.log(page);
      const ads: any = await this.scrapeSrealityAds(page);
      console.log(ads);
      if (ads.rows === null) { break; }
      // for(const a of ads.rows) {
      //   this.scrapedData.push({
      //     id: 0,
      //     name: a.flat.name.trim(),
      //     location: a.flat.location.trim(),
      //     price: a.flat.price.trim()
      //   });
      //   console.log('ad: ', a.flat.name.trim(), a.flat.location.trim(), a.flat.price.trim());
      // }
    }
    // console.log(this.scrapedData);
  }

  async startBrowser() {
    this.browser = await puppeteer.launch({ headless: false });
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



    // if (!this.page || !this.browser) {
    //   if (!this.browser) {
    //     await this.startBrowser();
    //   }

    //   if (this.browser){
    //     this.page = await this.browser.newPage();
        
    //     this.page.on('error', (error) => {
    //       console.log(error, 'PAGE ERROR');
    //     });
        
    //     await this.page.setRequestInterception(true);
        
    //     this.page.on('request', (req) => req.continue());
        
    //     this.page.on('response', (res) => {
    //       if (res.url() === url && res.status() === 429) {
    //         console.log(res, 'RES 429');
    //       }
    //     });
    //   }
    // }
    // if (this.page) {
    //   await this.page.goto(url, {
    //     waitUntil: ['domcontentloaded', 'networkidle2'],
    //   }).catch(e => console.log(e, 'prdoprd'));
    // }
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
      }
      reject(null);
    });
  }
}
