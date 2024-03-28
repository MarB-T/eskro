import JWT from 'jsonwebtoken';
import createError from 'http-errors';
import redisClient from './initRedis.js';


const signAccessToken = (userid) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: '12h',
      issuer: 'eskro.co.ke',
      audience: userid.toString()
    };
    JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
        // console.log(err.message);
        reject(createError.InternalServerError());
        }
        // console.log(`Access token signed: ${token}`);
        resolve(token);
    });
  });
}

const signRefreshToken = async (userid) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: '1y',
      issuer: 'eskro.co.ke',
      audience: userid.toString()
    };
    JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
        // console.log(err.message);
        reject(createError.InternalServerError());
        } else {
        // console.log('Connecting to redis...');
        // redisClient.connect();
          redisClient.SET(userid.toString(), token, {EX: 31536000})
          .then((reply) => {
            console.log(reply);
            resolve(token);
          })
          .catch((err) => {
            console.log(err.message);
            reject(createError.InternalServerError());
            return;
          });
        }  
         });   // redisClient.quit();}      
  });   
}

const verifyAccessToken = (req, res, next) => {
  if (!req.headers['authorization']) return next(createError.Unauthorized());
  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader.split(' ');
  const token = bearerToken[1];
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
      return next(createError.Unauthorized(message));
    }
    req.payload = payload;
    next();
  });
}

const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    JWT.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
      if (err) return reject(createError.Unauthorized());
      const userId = payload.aud;
      redisClient.GET(userId, (err, result) => {
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError());
          return;
        }
        if (token === result) return resolve(userId);
        reject(createError.Unauthorized());
      })
    });
  });
}

export { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken };