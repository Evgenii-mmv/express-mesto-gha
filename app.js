const express = require('express');
const mongoose = require('mongoose');
const { CODE, MESSAGE } = require('./code_answer/code_answer');

const { PORT = 3000 } = process.env;
// process- глобальный объект с информацией, с которой работает нода
const app = express(); // приложение
// use-используй , туда мы передаем функции промежуточной обработки(мидлевеяры)

//  преобразование данных в жсон
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/mestodb');

// 63c5560970ded1d3848ad349
app.use((req, res, next) => {
  req.user = {
    _id: '63c5560970ded1d3848ad349',
  };

  next();
});

app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));
app.use('/', require('./routes/noneexistent'));

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
  console.log(err.message);
  res.status(CODE.DEFAULT).send({ message: MESSAGE.DEFAULT });
  return next();
});

app.listen(PORT);
