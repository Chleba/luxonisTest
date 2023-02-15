import express, { Express } from 'express';
import Scraper from './src/scraper';

class ScraperApp {

  app: Express;
  port: number;
  isScraping: boolean;
  scraper?: Scraper;

  constructor() {
    this.app = express();
    this.port = 8081;
    this.isScraping = false;
    this.scraper = undefined;

    this.start();
  }

  start() {
    this.scraper = new Scraper();
    this.app = express();
    this.app.listen(this.port, () => {
      console.log(`Scraper App listening - port ${this.port}`);
    });
    this.setRoutes();
  }

  setRoutes() {
    // -- root
    this.app.get('/', (_req: any, res: any) => {
      res.send('chuzzzZZZ');
      // const filePath = path.join(path.resolve(), '/html/index.html');
      // res.sendFile(filePath);
    });

    this.app.get('/scrape', async (_req: any, res: any) => {
      if (!this.isScraping) {
        await this.scraper?.start();
      }
      res.send('scraping...');
    });
  }

}

const app = new ScraperApp();


// import express from 'express';
// import fetch from 'node-fetch';
// import path from 'path';
// import RunesCrawler from './runes_crawler.js';
// import PerkImgCrawler from './imgCrawler.js';
// import CONFIG from './config.js';
// import { MODE_TYPE } from './enums.js';

// class CrawlerApp {

//   constructor() {
//     this.runesCrawler = null;
//     this.perkImgCrawler = null;
//     this.app = null;
//     this.port = 8888;
//     this.version = null;

//     this.getActualLOLVersion();
//   }

//   start() {
//     this.runesCrawler = new RunesCrawler(this.version);
//     this.perkImgCrawler = new PerkImgCrawler(this.version);
//     this.app = express();
//     this.app.listen(this.port, () => {
//       console.log(`Crawler App listening - port ${this.port}`);
//     });
//     this.setRoutes();
//   }

//   async getActualLOLVersion() {
//     try {
//       const res = await fetch(CONFIG.LOL_VERSIONS_URL, {
//         method: "get",
//         headers: { "Content-Type": "application/json" }
//       });
//       const data = await res.json();
//       this.version = data[0];
//       this.start();
//     } catch(e) {
//       throw new Error(e);
//     }
//   }

//   setRoutes() {
//     // -- root
//     this.app.get('/', (_req, res) => {
//       const filePath = path.join(path.resolve(), '/html/index.html');
//       res.sendFile(filePath);
//     });

//     // -- STATE of the crawler
//     this.app.get('/state', (_req, res) => {
//       res.setHeader('Content-Type', 'application/json');
//       const stateJSON = this.runesCrawler.getState();
//       res.send(stateJSON);
//     });

//     // -- START crawler
//     this.app.get('/start', (_req, res) => {
//       // const mode = _req.query.mode || 'classic';
//       let mode = MODE_TYPE.CLASSIC;
//       switch(_req.query.mode) {
//         case 'classic':
//           mode = MODE_TYPE.CLASSIC;
//           break;
//         case 'aram':
//           mode = MODE_TYPE.ARAM;
//           break;
//         default:
//           mode = MODE_TYPE.CLASSIC;
//           break;
//       }
//       this.runesCrawler.start(mode);
//       res.send(`crawler star - ${_req.query.mode}`);
//     });

//     // -- STOP crawler
//     this.app.get('/stop', (_req, res) => {
//       this.runesCrawler.stop();
//       res.send('crawler stop');
//     });

//     // -- scrape single hero
//     this.app.get('/getHero', (req, res) => {
//       const heroId = req.query.heroId;
//       const isRunning = this.runesCrawler.getState().running;
//       const isValidHero = this.runesCrawler.scrapeHero(heroId);
//       let textRes = '';

//       if (isRunning) {
//         textRes = 'Crawler is still running - try it again later please maslo!';
//       } else {
//         textRes = isValidHero 
//           ? `Scraping Champion ID: ${heroId}` 
//           : `Wrong Champion ID: ${heroId}`;
//       }
//       res.send(textRes);
//     });

//     // -- get perks images
//     this.app.get('/getPerkImages', (req, res) => {
//       this.perkImgCrawler.start();
//       res.send('getting perk images');
//     });
//   }
// }

// const app = new CrawlerApp();
