import express from 'express';
import router from './routes/index.js';
import connectToDB from './utils/db.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT;

const app = express();

connectToDB()
  .then(() => { 
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/', router);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }).catch((err) => {
    console.error('Error connecting to the database', err);
    process.exit(1);
  });


export default app;