const express = require('express');
const { Joi, celebrate, errors } = require('celebrate'); // у нас нет такой зависимости
const mongoose = require('mongoose');
const { CODE, MESSAGE } = require('./code_answer/code_answer');
const auth = require('./middlewares/auth');
// const cookieParser = require('cookie-parser');
const { createUser, login } = require('./controllers/user');

const RegExp = /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;

const { PORT = 3000 } = process.env;
// process- глобальный объект с информацией, с которой работает нода
const app = express(); // приложение
// use-используй , туда мы передаем функции промежуточной обработки(мидлевеяры)

//  преобразование данных в жсон
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/mestodb');

// app.use(cookieParser());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(30),
    about: Joi.string()
      .min(2)
      .max(30),
    avatar: Joi.string()
      .min(2)
      .max(30)
      .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png')
      .pattern(RegExp),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }).unknown(true),
}), createUser);

app.use(auth);
app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));
app.use('/', require('./routes/noneexistent'));

app.use(errors());
app.use((err, req, res, next) => {
  /*
    err.name
      * ValidationError\CastError -> 400
      * NotFoundId/NotFoundPage -> 404
      * AccessError -> 403
      * else 500
  */
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(CODE.BAD_REQUEST).send({ message: MESSAGE.BAD_REQUEST });
  }
  if (err.name === 'NotFoundId' || err.name === 'NotFoundPage') {
    return res.status(CODE.NOT_FOUND).send({ message: MESSAGE.NOT_FOUND });
  }
  if (err.name === 'AccessError') {
    return res.status(CODE.FORBIDDEN).send({ message: MESSAGE.FORBIDDEN });
  }
  if (err.name === 'Login or password incorrect') {
    return res.status(CODE.INCORRECT_PAS_OR_LOG).send({ message: MESSAGE.INCORRECT_PAS_OR_LOG });
  }
  if (err.name === 'ConflictEmail') {
    return res.status(CODE.CONFLICT_EMAIL).send({ message: MESSAGE.CONFLICT_EMAIL });
  }
  res.status(CODE.DEFAULT).send({ message: MESSAGE.DEFAULT });
  return next();
});

app.listen(PORT);
