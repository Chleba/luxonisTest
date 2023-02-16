import express, { Express } from 'express';
import Scraper from './src/scraper';
import { Pool } from 'pg';


class ScraperApp {

  app: Express;
  port: number;
  isScraping: boolean;
  scraper?: Scraper;
  pool: Pool;

  constructor() {
    this.app = express();
    this.port = 8081;
    this.isScraping = false;
    this.scraper = undefined;
    this.pool = new Pool({
      database: 'myDB',
      user: 'test',
      password: 'test123',
    });

    this.start();
  }

  start() {
    this.scraper = new Scraper(this.batchCB.bind(this));
    this.app = express();
    this.app.listen(this.port, () => {
      console.log(`Scraper App listening - port ${this.port}`);
    });
    this.setRoutes();
  }

  setRoutes() {
    // -- root
    this.app.get('/', (_req: any, res: any) => {
      res.send('Hello from server');
      // const filePath = path.join(path.resolve(), '/html/index.html');
      // res.sendFile(filePath);
    });

    this.app.get('/scrape', async (_req: any, res: any) => {
      if (!this.scraper?.scapingState) {
        await this.scraper?.start();
      }
      res.send(this.scraper?.scapingState ? 'scraping in progress...' : 'done scraping');
    });
  }

  batchCB(data: any[]) {
    for(const d of data) {
      this.pool.query(`INSERT INTO ads (ad_id, name, location, price) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`, [
        d.id, d.name, d.location, d.price
      ]);
    }
  }
}

const app = new ScraperApp();
