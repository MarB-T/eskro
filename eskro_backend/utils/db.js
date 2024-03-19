import { MongoClient, ObjectId } from 'mongodb';

class DB {
  constructor() {
    this.client = new MongoClient(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  async connect() {
    await this.client.connect();
    this.db = this.client.db(process.env.DB_NAME);
  }

  async close() {
    await this.client.close();
  }

  async getCollection(name) {
    return this.db.collection(name);
  }

  async find(collection, query) {
    return collection.find(query).toArray();
  }

  async findOne(collection, query) {
    return collection.findOne(query);
  }

  async insertOne(collection, doc) {
    return collection.insertOne(doc);
  }

  async updateOne(collection, query, update) {
    return collection.updateOne(query, update);
  }

  async deleteOne(collection, query) {
    return collection.deleteOne(query);
  }
}

export default DB;