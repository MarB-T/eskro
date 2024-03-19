import DB from '../utils/db.js';

class UsersController {
    async create(req, res) {
        const db = new DB();
        await db.connect();
        const users = await db.getCollection('users');
        const user = await users.insertOne(req.body);
        await db.close();
        res.status(201).json(user);
    }
    
    async show(req, res) {
        const db = new DB();
        await db.connect();
        const users = await db.getCollection('users');
        const user = await users.findOne({ _id: ObjectId(req.params.id) });
        await db.close();
        res.status(200).json(user);
    }
    
    async update(req, res) {
        const db = new DB();
        await db.connect();
        const users = await db.getCollection('users');
        const user = await users.updateOne(
        { _id: ObjectId(req.params.id) },
        { $set: req.body }
        );
        await db.close();
        res.status(200).json(user);
    }
}

export default UsersController;