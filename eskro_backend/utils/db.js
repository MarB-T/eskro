import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const db = process.env.DB_NAME;
const uri = `mongodb://${host}:${port}/${db}`;

async function connectToDB() {
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(uri);
    } else {
      console.log('Using existing database connection');
    }
  } catch (err) {
      console.error('MongoDB connection error', err);
    }
}

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});


export default connectToDB


// 



// class DB {
//   constructor() {
//     this.client = new MongoClient(process.env.DB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });
//   }

//   async connect() {
//     await this.client.connect();
//     this.db = this.client.db(process.env.DB_NAME);
//   }

//   async close() {
//     await this.client.close();
//   }

//   async getCollection(name) {
//     return this.db.collection(name);
//   }

//   async find(collection, query) {
//     return collection.find(query).toArray();
//   }

//   async findOne(collection, query) {
//     return collection.findOne(query);
//   }

//   async insertOne(collection, doc) {
//     return collection.insertOne(doc);
//   }

//   async updateOne(collection, query, update) {
//     return collection.updateOne(query, update);
//   }

//   async deleteOne(collection, query) {
//     return collection.deleteOne(query);
//   }
// }

// export default DB;