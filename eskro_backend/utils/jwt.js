import JWT from 'jsonwebtoken';
import createError from 'http-errors';


const signAccessToken = (userid) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: '1h',
      issuer: 'eskro.co.ke',
      audience: userid.toString()
    };
    JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
        // console.log(err.message);
        reject(createError.InternalServerError());
        }
        resolve(token);
    });
  });
}

const signRefreshToken = (userid) => {
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
        }
        resolve(token);
    });
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

export { signAccessToken, signRefreshToken, verifyAccessToken };