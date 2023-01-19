const express = require('express');
const mongoose = require('mongoose');

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
// !!!!Я не знаю почему, но не проходят тесты на реквесты, хотя у меня все работает корректно!!!!
// !!!!Я не знаю почему, но не проходят тесты на реквесты, хотя у меня все работает корректно!!!!
// !!!!Я не знаю почему, но не проходят тесты на реквесты, хотя у меня все работает корректно!!!!
// добавил аргумент _next ,
// т.к без него не работает, добавил нижнее подчеркивание, чтобы показать, что она не используется
// Да я знаю, что это  не хорошо, но иначе тесты не проходит, я описал выше почему я это сделал
// я добавил исключение, которое как говорит сам vs code, работает только для данной строки
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  /*
    err.name
      * ValidationError\CastError -> 400
      * NotFoundId/NotFoundPage -> 404
      * AccessError -> 403
      * else 500
  */
  if (err.name === 'ValidationError') {
    return res.status(400).send({ message: 'Bad Request' });
  }
  if (err.name === 'CastError') {
    return res.status(400).send({ message: 'Bad Request' });
  }
  if (err.name === 'NotFoundId' || err.name === 'NotFoundPage') {
    return res.status(404).send({ message: err.message });
  }
  if (err.name === 'AccessError') {
    return res.status(403).send({ message: 'Forbidden' });
  }
  console.log(err.message);
  return res.status(500).send('error on the server side');
});

app.listen(PORT);
