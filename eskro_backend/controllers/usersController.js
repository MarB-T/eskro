//import DB from '../utils/db.js';
import UserModel from '../models/users.js';
import bcrypt from 'bcrypt';
import { validateUser, validateLogin } from '../utils/validation.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import createError from 'http-errors';
import redisClient from '../utils/initRedis.js';

class UsersController {
  async createUser(req, res) {
    const { error, value: validatedLoginData } = validateUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const emailRegistered = await UserModel.findOne({ email: validatedLoginData.email });
    const phoneNumberRegistered = await UserModel.findOne({ phoneNumber: validatedLoginData.phoneNumber });
    if (phoneNumberRegistered) {
      return res.status(400).json({ message: 'Phone number already exists' });
    }
    if (emailRegistered) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    //SMS verification
    // const verificationCode = Math.floor(1000 + Math.random() * 9000);
    // const message = `Your verification code is ${verificationCode}`;
    // const phoneNumber = req.body.phoneNumber;
    // const sms = await sendSMS(phoneNumber, message);
    // if (sms.error) {
    //   return res.status(500).json({ message: 'Failed to send verification code' });
    // }
    // const { code } = sms;
    // if (code !== verificationCode) {
    //   return res.status(400).json({ message: 'Invalid verification code' });
    // }

    const { password, ...userData } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    try {
      const newUser = await UserModel.create({ ...userData, password: hashedPassword });
      const accessToken = await signAccessToken(newUser._id);
      res.status(201).json({accessToken});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  }

  async loginUser(req, res, next) {
    try {
      const { error, value: validatedLoginData } = validateLogin(req.body);
      if (error) {
        // Use middleware for centralized error handling
        return next(new Error('Invalid login credentials'));
      }

      const user = await UserModel.findOne({ email: validatedLoginData.email });
      if (!user) {
        // Generic error message for production
        return res.status(400).json({ message: 'Invalid login credentials' });
      }
      // console.log(user);

      const { password } = user; // Destructuring assignment
      const validPassword = await bcrypt.compare(validatedLoginData.password, password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Invalid login credentials' });
      }
      // console.log(user._id)
      const accessToken = await signAccessToken(user._id);
      // console.log(accessToken);
      const refreshToken = await signRefreshToken(user._id);
      res.status(200).json({ accessToken, refreshToken });
    } catch (err) {
      // Handle unexpected errors using middleware
      return next(err);
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ message: 'Invalid request' });
      }
      const user = await verifyRefreshToken(refreshToken);
      const accessToken = await signAccessToken(user._id);
      const refToken = await signRefreshToken(user._id);
      res.status(200).json({ accessToken: accessToken, refToken: refreshToken });
    } catch (err) {
      next(err);
    }
  }

  async getAllUsers(req, res) {
    try {
      console.log(req.payload);
      const users = await UserModel.find();
      res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  }

  async logoutUser(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) throw createError.BadRequest();
      const userId = await verifyRefreshToken(refreshToken);
      redisClient.DEL(userId, (err, val) => {
        if (err) {
          console.log(err.message);
          throw createError.InternalServerError();
        }
        console.log(val);
        res.sendStatus(204);
      })
    } catch (err) {
      next(err);
    }
  }

  async updateUser(req, res) {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(req.params);
      res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  }

  async getUserByPhoneNumber(req, res) {
    try {
      const user = await UserModel.findOne({ phoneNumber: req.params.phoneNumber });
      res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const deletedUser = await UserModel.findByIdAndDelete(req.params);
      res.status(200).json(deletedUser);
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
