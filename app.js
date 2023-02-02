const express = require('express');
const { Joi, celebrate, errors } = require('celebrate');
const mongoose = require('mongoose');
const { MESSAGE } = require('./code_answer/code_answer');
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
    password: Joi.string().required(),
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
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);
app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));
app.use('/', require('./routes/noneexistent'));

app.use(errors());
app.use((err, req, res, next) => {
  console.log(err);
  console.log(err.statusCode);
  console.log(err.name);
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? MESSAGE.DEFAULT : err.message;
  res
    .status(statusCode)
    .send({ message });

  return next();
});

app.listen(PORT);
