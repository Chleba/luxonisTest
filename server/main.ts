import express, { Express } from 'express';
import Scraper from './src/scraper';
import { Pool } from 'pg';
import cors from 'cors';

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
      connectionString: `postgresql://test:test123@db:5432/mydb`
      // database: 'mydb',
      // user: 'test',
      // password: 'test123',
    });

    this.start();
  }

  start() {
    this.scraper = new Scraper(this.batchCB.bind(this));
    this.app.use(express.json());
    this.app.use(cors());
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

    this.app.get('/getData', (req: any, res: any) => {
      const limit = 20;
      const p = req.query.page ? (req.query.page * 1) : 1; // -- to number
      const page = Math.abs(p-1) * limit
      // this.pool.query(`SELECT ad_id, name, location, price FROM ads ORDER BY id LIMIT $1 OFFSET $2`, [
      this.pool.query(`WITH data AS (SELECT ad_id, name, location, price FROM ads ORDER BY id LIMIT $1 OFFSET $2), total_count AS (SELECT COUNT(*) FROM ads) SELECT *, (SELECT COUNT FROM total_count) as total_count FROM data`, [
        limit, page
      ], (err: any, dbRes: any) => {
        if (err) {
          console.log(err, 'server db ERROR');
          res.json({ error: 'DB failed to select', err: err });
        } else {
          res.json({ data: dbRes.rows });
        }
      });
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
