const jwt = require('jsonwebtoken'); // у нас нет такой зависимости

const { JWT_SECRET } = require('../controllers/user');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    res
      .status(401)
      .send({ message: 'Not Found' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    res
      .status(401)
      .send({ message: 'Not Found' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next();
};
