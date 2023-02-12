const jwt = require('jsonwebtoken'); // у нас нет такой зависимости

const { MESSAGE } = require('../code_answer/code_answer');
const { Unauthorized } = require('../error/unauthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Unauthorized(MESSAGE.INCORRECT_PAS_OR_LOG));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new Unauthorized(MESSAGE.INCORRECT_PAS_OR_LOG));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next();
};
