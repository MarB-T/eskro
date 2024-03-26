import express from 'express';
import router from './routes/index.js';
import connectToDB from './utils/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import redisClient from './utils/initRedis.js';
// import client from './utils/initRedis.js';

dotenv.config();

const port = process.env.PORT;

const app = express();
redisClient.connect();

connectToDB()
  .then(() => { 
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/', router);

    app.use((err, req, res, next) => {
      res.status(err.status || 500)
      res.send({
        error: {
          status: err.status || 500,
          message: err.message,
        },
      })
    })

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }).catch((err) => {
    console.error('Error connecting to the database', err);
    process.exit(1);
  });


export default app;