//import DB from '../utils/db.js';
import UserModel from '../models/users.js';

class UsersController {
  async createUser(req, res) {
    try {
      const newUser = await UserModel.create(req.body);
      res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await UserModel.find();
      res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  }
}

export default UsersController;

        // const db = new DB();
        // await db.connect();
        // const users = await db.getCollection('users');
        // const user = await users.insertOne(req.body);
        // await db.close();
        // res.status(201).json(user);
  
    
    // async show(req, res) {
    //     const db = new DB();
    //     await db.connect();
    //     const users = await db.getCollection('users');
    //     const user = await users.findOne({ _id: ObjectId(req.params.id) });
    //     await db.close();
    //     res.status(200).json(user);
    // }
    
    // async update(req, res) {
    //     const db = new DB();
    //     await db.connect();
    //     const users = await db.getCollection('users');
    //     const user = await users.updateOne(
    //     { _id: ObjectId(req.params.id) },
    //     { $set: req.body }
    //     );
    //     await db.close();
    //     res.status(200).json(user);
    // }
